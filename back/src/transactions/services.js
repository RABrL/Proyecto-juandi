const joi = require('joi')
const dotenv = require('dotenv')
const { v4 } = require('uuid')
const models = require('../models')
const { creditAccount, debitAccount } = require('../helpers/transactions')
const { AccountServices } = require('../accounts/services')
const { UsersService } = require('../users/services')
const createError = require('http-errors')

dotenv.config()

async function getById(id) {
  const transaction = await models.transactions.findOne({ where: { id } })
  if (!transaction)
    return {
      success: false,
      error: new createError.NotFound('No se encontro la transaccion')
    }
  if (transaction.metadata?.recipient_id) {
    const account = await AccountServices.getById(
      transaction.metadata.recipient_id
    )
    const user = await UsersService.getById(account.data.dataValues.user_id)
    transaction.dataValues.metadata.username = user.data.dataValues.username
  }
  if (transaction.metadata?.sender_id) {
    const account = await AccountServices.getById(
      transaction.metadata.sender_id
    )
    const user = await UsersService.getById(account.data.dataValues.user_id)
    transaction.dataValues.metadata.username = user.data.dataValues.username
  }
  return {
    success: true,
    message: 'Transaccion encontrada',
    data: transaction
  }
}

async function getAllByAccountId(account_id) {
  const transactions = await models.transactions.findAll({
    where: { account_id },
    order: [['createdAt', 'DESC']]
  })
  if (!transactions)
    return {
      success: false,
      error: new createError.NotFound(
        `No se encontraron transacciones para la cuenta ${account_id}`
      )
    }
  const transactionsWithUser = await Promise.all(
    transactions.map(({ dataValues }) => {
      return getById(dataValues.id)
    })
  )
  return {
    success: true,
    message: 'Transacciones encontradas',
    data: transactionsWithUser.map((transaction) => transaction.data)
  }
}

async function getAllByUserId(user_id) {
  const account = await AccountServices.getByUserId(user_id)
  if (!account.success)
    return {
      success: false,
      error: res.error
    }
  const result = await getAllByAccountId(account.data.id)
  if (!result.success)
    return {
      success: false,
      error: result.error
    }
  return {
    success: true,
    message: 'Transacciones encontradas',
    data: result.data
  }
}

/**
 * @param {number} account_id account_id of the account
 * @param {number} amount amount to deposit
 */
async function deposit(account_id, amount) {
  const schema = joi.object({
    account_id: joi.number().required(),
    amount: joi.number().min(1).required()
  })
  const validation = schema.validate({ account_id, amount })
  if (validation.error) {
    return {
      success: false,
      error: new createError.BadRequest(validation.error.details[0].message)
    }
  }
  const t = await models.sequelize.transaction()
  try {
    const creditResult = await creditAccount({
      account_id,
      amount,
      purpose: 'deposit',
      t
    })
    if (!creditResult.success) {
      await t.rollback()
      return creditResult
    }

    await t.commit()
    return {
      success: true,
      message: 'deposit successful'
    }
  } catch (error) {
    await t.rollback()
    return {
      success: false,
      error: new createError.InternalServerError('there was error')
    }
  }
}

/**
 * @param {number} account_id account_id of the account
 * @param {number} amount amount to withdraw
 */
async function withdraw(account_id, amount) {
  const schema = joi.object({
    account_id: joi.number().required(),
    amount: joi.number().min(1).required()
  })
  const validation = schema.validate({ account_id, amount })
  if (validation.error) {
    return {
      success: false,
      error: new createError.BadRequest(validation.error.details[0].message)
    }
  }
  const t = await models.sequelize.transaction()
  try {
    const debitResult = await debitAccount({
      account_id,
      amount,
      purpose: 'withdrawal',
      t
    })

    if (!debitResult.success) {
      await t.rollback()
      return debitResult
    }

    await t.commit()
    return {
      success: true,
      message: 'withdrawal successful'
    }
  } catch (error) {
    await t.rollback()
    return {
      success: false,
      error: new createError.InternalServerError('there was error')
    }
  }
}

/**
 * @param {number} sender_id account_id of the sender
 * @param {number} recipient_id account_id of the recipient
 * @param {number} amount amount to deposit
 */
async function transfer(sender_id, recipient_id, amount) {
  const schema = joi.object({
    sender_id: joi.number().required(),
    recipient_id: joi.number().required(),
    amount: joi.number().min(1).required()
  })
  const validation = schema.validate({ sender_id, recipient_id, amount })
  if (validation.error) {
    return {
      success: false,
      error: new createError.BadRequest(validation.error.details[0].message)
    }
  }

  const t = await models.sequelize.transaction()
  try {
    const reference = v4()
    const purpose = 'transfer'

    const transferResult = await Promise.all([
      debitAccount({
        amount,
        account_id: sender_id,
        purpose,
        reference,
        metadata: {
          recipient_id
        },
        t
      }),
      creditAccount({
        amount,
        account_id: recipient_id,
        purpose,
        reference,
        metadata: {
          sender_id
        }
      })
    ])

    const failedTxns = transferResult.filter((result) => !result.success)
    if (failedTxns.length) {
      await t.rollback()
      return transferResult
    }

    await t.commit()
    return {
      success: true,
      message: 'transfer successful'
    }
  } catch (error) {
    await t.rollback()
    return {
      success: false,
      error: 'internal server error'
    }
  }
}

/**
 * @param {string} reference reference of the transaction to reverse
 */
async function reverse(reference) {
  // find the transaction
  const t = await models.sequelize.transaction()
  const txn_reference = v4()
  const purpose = 'reversal'
  try {
    const transactions = await models.transactions.findAll(
      {
        where: { reference }
      },
      { transaction: t }
    )
    const transactionsArray = transactions.map((transaction) => {
      if (transaction.txn_type === 'debit') {
        return creditAccount({
          amount: transaction.amount,
          account_id: transaction.account_id,
          metadata: {
            originalReference: transaction.reference
          },
          purpose,
          reference: txn_reference,
          t
        })
      }
      return debitAccount({
        amount: transaction.amount,
        account_id: transaction.account_id,
        metadata: {
          originalReference: transaction.reference
        },
        purpose,
        reference: txn_reference,
        t
      })
    })
    const reversalResult = await Promise.all(transactionsArray)

    const failedTxns = reversalResult.filter((result) => !result.success)
    if (failedTxns.length) {
      await t.rollback()
      return reversalResult
    }

    await t.commit()
    return {
      success: true,
      message: 'Reversal successful'
    }
  } catch (error) {
    await t.rollback()
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

module.exports.TransactionService = {
  deposit,
  withdraw,
  transfer,
  reverse,
  getById,
  getAllByUserId
}

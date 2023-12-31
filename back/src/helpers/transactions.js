const { v4 } = require('uuid');
const models = require('../models');
const { AccountServices } = require('../accounts/services');
const createError = require('http-errors');

async function creditAccount({
  amount, account_id, purpose, reference = v4(), metadata, t,
}) {
  const account = await AccountServices.getById(account_id);
  if (!account) {
    return {
      success: false,
      error: new createError.NotFound('Account does not exist'),
    };
  }

  await models.accounts.increment(
    { balance: amount }, { where: { id: account_id }, transaction: t },
  );

  await models.transactions.create({
    txn_type: 'credit',
    purpose,
    amount,
    account_id,
    reference,
    metadata,
    balance_before: Number(account.balance),
    balance_after: Number(account.balance) + Number(amount),
    created_at: Date.now(),
    updated_at: Date.now(),
  }, {
    transaction: t,
  });
  return {
    success: true,
    message: 'Credit successful',
  };
}

async function debitAccount({
  amount, account_id, purpose, reference = v4(), metadata, t,
}) {
  const account = await AccountServices.getById(account_id);

  if (!account) {
    return {
      success: false,
      error: new createError.NotFound('Account does not exist'),
    };
  }

  if (Number(account.balance) < amount) {
    return {
      success: false,
      error: new createError.BadRequest('Balance insuficiente'),
    };
  }
  await models.accounts.increment(
    { balance: -amount }, { where: { id: account_id }, transaction: t },
  );
  await models.transactions.create({
    txn_type: 'debit',
    purpose,
    amount,
    account_id,
    reference,
    metadata,
    balance_before: Number(account.balance),
    balance_after: Number(account.balance) - Number(amount),
    created_at: Date.now(),
    updated_at: Date.now(),
  }, {
    transaction: t,
  });
  return {
    success: true,
    message: 'Debit successful',
  };
}

module.exports = { creditAccount, debitAccount };

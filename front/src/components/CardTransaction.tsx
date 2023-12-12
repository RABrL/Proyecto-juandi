import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/pages/transactions/index.astro'

enum Purpose {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
  Transfer = 'transfer',
  Reversal = 'reversal'
}

enum TxnType {
  Credit = 'credit',
  Debit = 'debit'
}

export default function CardTransaction({
  transaction
}: { transaction: Transaction }) {
  const { amount, created_at, metadata, purpose, reference, txn_type } =
    transaction

  const onReverse = () => {
    fetch(`http://localhost:8080/api/transaction/reverse/${reference}`, {
      method: 'PUT'
    }).then((res) => {
      if (res.status === 200) {
        alert('Transaccion revertida')
        location.reload()
      }
    })
  }
  return (
    <Card
      className={cn('bg-rose-100', {
        'bg-green-100': txn_type === TxnType.Credit
      })}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {purpose === Purpose.Transfer && (
              <span className="font-medium">
                {txn_type === TxnType.Credit
                  ? `Recibiste ${amount} de ${metadata?.username}`
                  : `Enviaste ${amount} a ${metadata?.username}`}
              </span>
            )}
            {purpose === Purpose.Deposit && (
              <div>
                <span className="font-medium">+</span>
                {amount}
              </div>
            )}
            {purpose === Purpose.Withdrawal && (
              <div>
                <span className="font-medium">-</span>
                {amount}
              </div>
            )}
          </CardTitle>
          <CardDescription className="flex flex-col">
            Fecha de la transaccion:{' '}
            <span className="font-medium">{created_at}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <span className="font-medium text-lg">
            Tipo:{' '}
            {purpose === Purpose.Deposit
              ? 'Deposito'
              : purpose === Purpose.Transfer
              ? 'Transferencia'
              : purpose === Purpose.Withdrawal
              ? 'Retiro'
              : 'Revertida'}
          </span>
        </div>
      </CardContent>
      {!metadata?.sender_id && purpose !== Purpose.Reversal && (
        <CardFooter>
          <button
            onClick={onReverse}
            className="bg-rose-600 px-4 py-1 rounded text-white hover:bg-rose-500 transition-colors"
            id={reference}
          >
            Reverse
          </button>
        </CardFooter>
      )}
    </Card>
  )
}

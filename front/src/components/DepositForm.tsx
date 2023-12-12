import InputAmount from './InputAmount'

export default function DepositForm({ accountId }: { accountId: number }) {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const amount = Number(formData.get('amount'))

    await fetch(`http://localhost:8080/api/transaction/deposit/${accountId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    }).then((res) => {
      if (res.ok) {
        alert('Depósito realizado con éxito')
        window.location.href = '/'
      } else {
        alert('No se pudo realizar el depósito')
      }
    })
  }
  return (
    <form onSubmit={onSubmit} className="py-10 max-w-3xl mx-auto">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Deposita dinero a tu cuenta
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Ingresa la cantidad que vas a depositar (min 10.000).
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <InputAmount />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <a href="/" className="text-sm font-semibold leading-6 text-gray-900">
          Cancelar
        </a>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Depositar
        </button>
      </div>
    </form>
  )
}

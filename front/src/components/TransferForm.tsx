import InputAmount from './InputAmount'

export default function TransferForm({
  accountId,
  balance
}: { accountId: number; balance: number }) {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const amount = Number(formData.get('amount'))
    const username = formData.get('username')

    const data = await fetch(
      `http://localhost:8080/api/users/name/${username}`
    ).then((res) => {
      if (!res.ok) {
        alert(
          'El usuario al que esta intenando enviar el dinero aún no tiene una cuenta'
        )
        return
      }
      return res.json()
    })

    if (!data) return

    await fetch(`http://localhost:8080/api/transaction/transfer/${accountId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ receptor_id: data.body.id, amount })
    }).then((res) => {
      if (res.ok) {
        alert('Retiro realizado con éxito')
        window.location.href = '/'
      } else {
        alert('No se pudo realizar el retiro')
      }
    })
  }
  return (
    <form onSubmit={onSubmit} className="py-10 max-w-3xl mx-auto">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Envia dinero a otra cuenta
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Ingresa la cantidad que vas a retirar (min 10.000, max {balance}){' '}
            <br />
            y el username de la persona a la que le vas a enviar el dinero.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    required
                    min={10000}
                    max={balance}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Pepito Perez"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <InputAmount balance={balance} />
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
          Enviar
        </button>
      </div>
    </form>
  )
}

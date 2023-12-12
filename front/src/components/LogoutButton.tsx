export default function LogoutButton() {
  const onClick = async () => {
    await fetch('/api/signout')
    window.location.reload()
  }
  return <button className='bg-gray-600 hover:bg-gray-500 rounded-md px-4 py-1 text-white' onClick={onClick}>Cerrar sesión</button>
}

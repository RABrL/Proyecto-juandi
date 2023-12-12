import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Popover } from '@headlessui/react'

import Logo from './Logo'
import BurgerMenuItem from './BurgerMenuItem'
import LogoutButton from './LogoutButton'

export default function BurgerMenu() {
  return (
    <Popover className="ml-4">
      <Popover.Button className="bg-slate-100 rounded-md p-2 text-slate-400 hover:text-slate-500">
        <span className="sr-only">Open menu</span>
        <Bars3Icon className="h-6 w-6 " />
      </Popover.Button>
      <Popover.Overlay className="fixed inset-0 bg-slate-800/30" />
      <Popover.Panel className="fixed inset-x-0 top-0 z-50 m-1 opacity-100 scale-100">
        <div className="rounded-xl shadow-lg  bg-white m-2">
          <header className="flex justify-between items-center py-3 px-5">
            <div className="flex justify-start lg:w-1/4">
              <Logo />
            </div>
            <Popover.Button
              className="bg-slate-100 rounded-md p-2 text-slate-400 hover:text-slate-500"
              type="button"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" />
            </Popover.Button>
          </header>
          <nav className="py-3 px-5 text-lg text-slate-800 font-medium">
            <BurgerMenuItem href="/transfer">Hacer transacción</BurgerMenuItem>
            <BurgerMenuItem href="/transactions">
              Mis transacciones
            </BurgerMenuItem>
          </nav>
          <footer className="flex text-center px-5 rounded-b-xl bg-slate-50 py-4 space-x-6">
            <LogoutButton />
          </footer>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

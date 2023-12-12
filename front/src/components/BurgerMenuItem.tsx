export default function BurgerMenuItem({
  href,
  children
}: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="hover:bg-slate-100 flex items-center w-full h-14 transition-colors rounded-lg"
    >
      {children}
    </a>
  )
}

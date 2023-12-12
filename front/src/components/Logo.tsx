export default function Logo({
  width = 80,
  href = '/'
}: { width?: number; href?: string }) {
  return (
    <a href={href}>
      <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
    </a>
  )
}

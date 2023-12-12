import type { APIRoute } from 'astro'


export const POST: APIRoute = async ({ request, cookies }) => {
  const { username, password } = await request.json()

  const res = await fetch('http://localhost:8080/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        message: 'Error'
      }),
      { status: res.status }
    )
  }

  const json = await res.json()

  if (!json?.body) {
    return new Response(JSON.stringify(json?.message), { status: res.status })
  }

  cookies.set('user-id', json.body.id, { path: '/' })

  return new Response(JSON.stringify(json), {
    status: res.status
  })
}

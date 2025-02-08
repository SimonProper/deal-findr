import { createFileRoute, Link } from '@tanstack/react-router'
import {} from '@tanstack/start'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <div>
      <a
        href={
          'https://accounts.google.com/o/oauth2/v2/auth?' +
          new URLSearchParams({
            client_id:
              '602791468555-octqj64m7h4nia88tnap5pu4755a4e0b.apps.googleusercontent.com',
            response_type: 'code',
            // grant_type: "authorization_code",
            access_type: 'offline',
            redirect_uri: 'http://localhost:3000/auth/callback/google',
            scope: 'openid profile email',
          }).toString()
        }
      >
        Google
      </a>
    </div>
  )
}

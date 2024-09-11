import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex flex-col h-full w-full justify-center items-center p-24 min-h-screen">
      <h1>Sign in</h1>
      <Link
        href={{
          pathname: "https://accounts.google.com/o/oauth2/v2/auth",
          query: {
            client_id:
              "602791468555-octqj64m7h4nia88tnap5pu4755a4e0b.apps.googleusercontent.com",
            response_type: "code",
            // grant_type: "authorization_code",
            access_type: "offline",
            redirect_uri: "http://localhost:3000/auth/callback/google",
            scope: "openid profile email",
          },
        }}
      >
        Google
      </Link>
    </main>
  );
}

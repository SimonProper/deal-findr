"use client";

import Link from "next/link";
import { api } from "../trpc/react";
import { useSession } from "../lib/auth/session-provider";

const ClientComponent = () => {
  const [greetings] = api.products.getProduct.useSuspenseQuery();
  const whoAmIResult = api.user.whoAmI.useQuery(undefined, { retry: false });
  const { data, isAuthenticated } = useSession();

  return (
    <div>
      <h2>{greetings.msg}</h2>
      {isAuthenticated && <div>{data.user.firstName}</div>}
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
    </div>
  );
};

export default ClientComponent;

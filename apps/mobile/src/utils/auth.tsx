import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as Browser from "expo-web-browser";

import { api } from "./api";
import { deleteToken, setToken } from "./session-store";

export const signIn = async () => {
  const redirectTo = Linking.createURL("login");
  const signInUrl = `http:localhost:3000/auth/mobile?expo-redirect=${redirectTo}`;

  const result = await Browser.openAuthSessionAsync(`${signInUrl}`, redirectTo);

  if (result.type !== "success") return;
  const url = Linking.parse(result.url);
  const sessionToken = String(url.queryParams?.auth_session);
  console.log({ sessionToken });
  if (!sessionToken) return;

  setToken(sessionToken);
};

export const useUser = () => {
  const { data: session } = api.user.whoAmI.useQuery();
  return session ?? null;
};

export const useSignIn = () => {
  const utils = api.useUtils();
  const router = useRouter();

  return async () => {
    await signIn();
    await utils.invalidate();
    router.replace("/");
  };
};

export const useSignOut = () => {
  const utils = api.useUtils();
  const signOut = api.auth.signOut.useMutation();
  const router = useRouter();

  return async () => {
    const res = await signOut.mutateAsync();
    await deleteToken();
    await utils.invalidate();
    router.replace("/");
  };
};

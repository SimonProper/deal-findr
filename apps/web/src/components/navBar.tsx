"use client";
import Image from "next/image";
import { api } from "../trpc/react";

const NavBar = () => {
  const utils = api.useUtils();
  const { isSuccess, data } = api.user.whoAmI.useQuery(undefined, {
    retry: false,
  });
  const signout = api.auth.signOut.useMutation({
    onSuccess() {
      utils.user.whoAmI.invalidate();
    },
  });
  return (
    <div className="w-full flex items-center gap-2 justify-end p-4">
      {isSuccess ? (
        <>
          <button onClick={() => signout.mutate()}>signout</button>

          <p>{data.firstName + data.lastName}</p>

          {data.profilePictureUrl ? (
            <Image
              src={data.profilePictureUrl}
              alt="profile picture"
              height={48}
              width={48}
              className="rounded-full"
            />
          ) : (
            <p>
              {`${data.firstName.at(0)}${data.lastName.at(0)}`.toUpperCase()}
            </p>
          )}
        </>
      ) : (
        <>
          <button>Sign in</button>
          {signout.isSuccess && <p>{signout.data.msg}</p>}
        </>
      )}
    </div>
  );
};

export default NavBar;

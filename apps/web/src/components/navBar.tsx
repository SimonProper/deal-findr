"use client";
import Image from "next/image";
import { api } from "../trpc/react";
import { useSession, useSignOut } from "../lib/auth/session-provider";
import Link from "next/link";

const NavBar = () => {
  const { data, status } = useSession();
  const signOut = useSignOut();
  return (
    <div className="w-full flex items-center gap-2 justify-end p-4">
      {status === "authenticated" ? (
        <>
          <button onClick={() => signOut.mutate()}>signout</button>

          <p>{data.user.firstName + data.user.lastName}</p>

          {data.user.profilePictureUrl ? (
            <Image
              src={data.user.profilePictureUrl}
              alt="profile picture"
              height={48}
              width={48}
              className="rounded-full"
            />
          ) : (
            <p>
              {`${data.user.firstName.at(0)}${data.user.lastName.at(
                0,
              )}`.toUpperCase()}
            </p>
          )}
        </>
      ) : (
        <>
          <Link href={"/auth/sign-in"}>Sign in</Link>
        </>
      )}
    </div>
  );
};

export default NavBar;

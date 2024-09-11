"use client";

import { useSession } from "@/src/lib/auth/session-provider";
import { api } from "@/src/trpc/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// Should maybe turn into a route instead of page
export default function Page({ params }: { params: { provider: string } }) {
  const searchParams = useSearchParams();
  const utils = api.useUtils();

  const { status, data, mutate, isSuccess } = api.auth.verifyAuth.useMutation({
    onSuccess: () => {
      utils.user.whoAmI.reset();
    },
  });

  const { data: session, isAuthenticated } = useSession();

  const code = searchParams.get("code");

  return (
    <div>
      <p>callbackProvider {params.provider}</p>
      <p>code {code}</p>
      <button
        className="bg-neutral-700 py-2 px-4 rounded"
        onClick={() => code && mutate({ code })}
      >
        login
      </button>
      <p>{status}</p>
      {isSuccess && isAuthenticated && (
        <>
          {session.user.profilePictureUrl && (
            <Image
              src={session.user.profilePictureUrl}
              alt="profile picture"
              height={48}
              width={48}
              className="rounded-full"
            />
          )}
          <p>{session.user.firstName + session.user.lastName}</p>
        </>
      )}
    </div>
  );
}

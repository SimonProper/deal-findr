"use client";

import { api } from "@/src/trpc/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Page({ params }: { params: { provider: string } }) {
  const searchParams = useSearchParams();
  const { status, data, mutate, isSuccess } = api.auth.verifyAuth.useMutation();

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
      {isSuccess && (
        <>
          <Image
            src={data.picture}
            alt="profile picture"
            height={48}
            width={48}
            className="rounded-full"
          />
          <p>{data.given_name + data.family_name}</p>
        </>
      )}
    </div>
  );
}

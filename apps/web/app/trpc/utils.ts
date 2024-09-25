// @filename: client.ts
import type { AppRouter } from "@deal-findr/backend/src/trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

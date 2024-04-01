import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@deal-findr/scraper/src/trpc";
import SuperJSON from "superjson";

const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
      transformer: SuperJSON,
      // You can pass any HTTP headers you wish here
      async headers() {
        const headers = new Headers();
        headers.set("x-trpc-source", "nextjs-server");
        return headers;
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

export default api;

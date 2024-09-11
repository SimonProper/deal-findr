import type { Metadata } from "next";
import { TRPCReactProvider } from "../trpc/react";
import "./globals.css";
import NavBar from "../components/navBar";
import { SessionProvider } from "../lib/auth/session-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const metadata: Metadata = {
  title: "Deal Findr",
  description: "An app to track your favorite products",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          "min-h-screen bg-background font-sans text-foreground antialiased"
        }
      >
        <TRPCReactProvider>
          <SessionProvider>
            <NavBar />
            {props.children}
          </SessionProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </TRPCReactProvider>
      </body>
    </html>
  );
}

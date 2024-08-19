import type { Metadata } from "next";
import { TRPCReactProvider } from "../trpc/react";
import "./globals.css";
import NavBar from "../components/navBar";

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
          <NavBar />
          {props.children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}

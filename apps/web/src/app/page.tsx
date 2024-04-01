import { Suspense } from "react";
import ClientComponent from "../components/clientComponent";

export default async function Home() {
  return (
    <main className="flex flex-col h-full w-full justify-center items-center p-24 min-h-screen">
      <Suspense fallback={<h1>loading...</h1>}>
        <h1>Server</h1>
        <ClientComponent />
      </Suspense>
    </main>
  );
}

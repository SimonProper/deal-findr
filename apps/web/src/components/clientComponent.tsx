"use client";

import { api } from "../trpc/react";

const ClientComponent = () => {
  const [greetings, result] = api.products.getProduct.useSuspenseQuery();
  return <h2>{greetings.msg}</h2>;
};

export default ClientComponent;

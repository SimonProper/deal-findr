import type { SafeParseReturnType } from "zod";

type Ok<T> = {
  ok: true;
  value: T;
};

type Err<E = Error> = {
  ok: false;
  error: E;
};

export type Result<T, E = Error> = Ok<T> | Err<E>;
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  console.error(error);
  return { ok: false, error };
}

export function zToResult<Input, Output>(
  res: SafeParseReturnType<Input, Output>,
) {
  return res.success ? ok(res.data) : err(res.error);
}

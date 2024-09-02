import { err, ok } from "neverthrow";
import type { SafeParseReturnType } from "zod";

export function zToResult<Input, Output>(
  res: SafeParseReturnType<Input, Output>,
) {
  return res.success ? ok(res.data) : err(res.error);
}

import { ApiError } from "./api";

export async function handle<T, E = ApiError>(
  promise: Promise<T>,
): Promise<[null, T] | [E, null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as E, null];
  }
}

/**
 * Shared Next.js route handler helper types.
 */
export type AsyncRouteParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

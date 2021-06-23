export type Draft<T, D extends keyof T> = {
  [K in keyof T]: K extends D ? T[K] | null : T[K];
};

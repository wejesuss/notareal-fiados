export function isShallowEqual<T extends object>(obj_a: T, obj_b: T): boolean {
  const keys_a = Object.keys(obj_a);
  const keys_b = Object.keys(obj_b);

  if (keys_a.length !== keys_b.length) {
    return false;
  }

  for (const key_a of keys_a) {
    if (!Object.hasOwn(obj_b, key_a)) {
      return false;
    }

    if (obj_b[key_a as keyof T] !== obj_a[key_a as keyof T]) {
      return false;
    }
  }

  return true;
}

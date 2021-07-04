import { modulePath } from "./const";

export function profile(userId: string | number) {
  return `${modulePath}/${userId}/profile`;
}

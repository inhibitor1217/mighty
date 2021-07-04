import { modulePath } from "./const";

export function userProfile(userId: string | number) {
  return `${modulePath}/${userId}/profile`;
}

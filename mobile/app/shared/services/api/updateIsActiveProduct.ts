import { api } from "./api";

export function updateIsActiveProduct(id: string, is_active: boolean) {
  return api.instance.patch(`/products/${id}`, { is_active });
}

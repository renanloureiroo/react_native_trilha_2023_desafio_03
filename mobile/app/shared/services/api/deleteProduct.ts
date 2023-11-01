import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

export function deleteProduct(
  id: string
): Promise<AxiosResponse<void, RequestError>> {
  return api.instance.delete<void>(`/products/${id}`);
}

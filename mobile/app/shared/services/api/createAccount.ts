import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

function createAccount<T = any>(
  params: FormData
): Promise<AxiosResponse<T, RequestError>> {
  return api.instance.post<T>("/users", params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export { createAccount };

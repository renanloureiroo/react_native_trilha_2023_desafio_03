import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

type Image = {
  id: string;
  path: string;
  product_id: string;
  created_at: Date;
  updated_at: Date;
};

export function createProductImages(
  params: FormData
): Promise<AxiosResponse<Image[], RequestError>> {
  return api.instance.post<Image[]>("/products/images", params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

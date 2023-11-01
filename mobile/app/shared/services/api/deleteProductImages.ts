import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

interface ICreateProductParams {
  productImagesIds: string[];
}

export function deleteProductImages(
  params: ICreateProductParams
): Promise<AxiosResponse<any, RequestError>> {
  return api.instance.delete("/products/images", { data: params });
}

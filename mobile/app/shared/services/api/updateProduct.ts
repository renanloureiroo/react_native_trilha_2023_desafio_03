import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

interface IUpdateProductParams {
  id: string;
  name: string;
  description: string;
  accept_trade: boolean;
  is_new: boolean;
  payment_methods: string[];
  price: number;
}

interface IUpdateProductResponse {
  id: string;
  name: string;
  description: string;
  is_new: true;
  price: number;
  accept_trade: true;
  user_id: string;
  is_active: true;
  created_at: Date;
  updated_at: Date;
}

export function updateProduct(
  params: IUpdateProductParams
): Promise<AxiosResponse<IUpdateProductResponse, RequestError>> {
  const { id, ...rest } = params;
  console.log("id", id);
  const url = `/products/${id}`;
  return api.instance.put<IUpdateProductResponse>(url, { ...rest });
}

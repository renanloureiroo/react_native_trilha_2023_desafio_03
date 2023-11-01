import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

interface ICreateProductParams {
  name: string;
  description: string;
  accept_trade: boolean;
  is_new: boolean;
  payment_methods: string[];
  price: number;
}

interface ICreateProductResponse {
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

export function createProduct(
  params: ICreateProductParams
): Promise<AxiosResponse<ICreateProductResponse, RequestError>> {
  return api.instance.post<ICreateProductResponse>("/products", { ...params });
}

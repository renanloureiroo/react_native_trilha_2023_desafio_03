import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

export interface IGetProductByIdResponse {
  id: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images: ProductImage[];
  payment_methods: PaymentMethod[];
  user: User;
}

export interface ProductImage {
  path: string;
  id: string;
}

export interface PaymentMethod {
  key: string;
  name: string;
}

export interface User {
  avatar: string;
  name: string;
  tel: string;
}

export function getProductById<T = IGetProductByIdResponse>(
  id: string
): Promise<AxiosResponse<T, RequestError>> {
  const url = encodeURI(`/products/${id}`);
  return api.instance.get<T>(url);
}

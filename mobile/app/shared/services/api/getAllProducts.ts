import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  is_new: boolean;
  is_active: boolean;
  accept_trade: boolean;
  product_images: { path: string; id: string }[];
  payment_methods: { key: string; name: string }[];
  user: {
    avatar: string;
    name: string;
  };
};

export function getAllProducts<T = Product[]>(): Promise<
  AxiosResponse<T, RequestError>
> {
  return api.instance.get<T>("/products");
}

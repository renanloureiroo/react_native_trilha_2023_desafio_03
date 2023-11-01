import { AxiosResponse } from "axios";
import { RequestError, api } from "./api";

type Product = {
  id: string;
  name: string;
  price: number;
  is_new: boolean;
  is_active: boolean;
  accept_trade: boolean;
  product_images: { path: string; id: string }[];
  payment_methods: { key: string; name: string }[];
  user: {
    avatar: string;
  };
};

export function getMyProducts<T = Product[]>(): Promise<
  AxiosResponse<T, RequestError>
> {
  return api.instance.get<T>("/users/products");
}

import { ProductContext } from "../contexts";
import { useContext } from "react";

export const useProducts = () => {
  const context = useContext(ProductContext);

  return context;
};

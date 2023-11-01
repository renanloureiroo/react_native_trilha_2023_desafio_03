import { CreateAndEditContext } from "@contexts";
import { useContext } from "react";

export const useCreateAndEdit = () => {
  const context = useContext(CreateAndEditContext);

  return context;
};

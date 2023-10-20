import { AuthContext } from "@contexts";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

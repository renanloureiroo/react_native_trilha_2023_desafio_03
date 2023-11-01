import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { config } from "@config";
import { api, createSession } from "@services";
import { storage } from "@utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export type User = {
  id: string;
  name: string;
  email: string;
  tel: string;
  avatar?: string;
};

type SignInParams = {
  email: string;
  password: string;
};

interface IAuthContextProps {
  user: User;
  heydrated: boolean;
  signIn: (params: SignInParams) => Promise<void>;
  signOut: () => Promise<void>;
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}

export const AuthContext = createContext({} as IAuthContextProps);

interface IAuthContextProviderProps {
  children: ReactNode;
}
export const AuthContextProvider: FC<IAuthContextProviderProps> = ({
  children,
}) => {
  const [heydrated, setHeydrated] = useState<boolean>(true);
  const [user, setUser] = useState<User>({} as User);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const signIn = useCallback(async (params: SignInParams) => {
    try {
      const { data } = await createSession(params);

      const avatarUrl = data.user?.avatar
        ? `${config.baseURL}/images/${data.user.avatar}`
        : "";

      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        tel: data.user.tel,
        avatar: avatarUrl,
      };
      await api.updateCredentials({
        access_token: data.token,
        refresh_token: data.refresh_token,
      });
      await storage.save("user_data", userData);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    api.instance.defaults.headers.common["Authorization"] = "";
    await storage.delete("access_token");
    await storage.delete("refres_token");
    await storage.delete("user_data");
    setUser({} as User);
  }, []);

  const heydrate = async () => {
    storage
      .get<User>("user_data")
      .then((user) => {
        setUser(user);
      })
      .catch((err) => console.tron.log!("Heytradted error:", err))
      .finally(() => setHeydrated(false));
  };

  useEffect(() => {
    heydrate();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        heydrated,
        bottomSheetRef,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

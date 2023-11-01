import { config } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import { getMyProducts } from "@services";
import { FC, ReactNode, createContext, useCallback, useState } from "react";

type CardProducts = {
  id: string;
  name: string;
  price: number;
  is_new: boolean;
  thumbnail?: string;
};

type ProductContextType = {
  myAds: CardProducts[];
  loadingMyAds: boolean;
};

export const ProductContext = createContext<ProductContextType>(
  {} as ProductContextType
);

export const ProductContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [loadingMyAds, setLoadingMyAds] = useState<boolean>(false);
  const [myAds, setMyAds] = useState<CardProducts[]>([]);

  const fecthProducts = async () => {
    try {
      setLoadingMyAds(true);
      const { data } = await getMyProducts();

      const formattedData = data.map(
        ({ id, name, is_new, product_images, price }) => ({
          id,
          name,
          price,
          is_new,
          thumbnail:
            product_images.length > 0
              ? `${config.baseURL}/images/${product_images[0].path}`
              : undefined,
        })
      );

      setMyAds(formattedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMyAds(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fecthProducts();
    }, [])
  );

  return (
    <ProductContext.Provider
      value={{
        myAds,
        loadingMyAds,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

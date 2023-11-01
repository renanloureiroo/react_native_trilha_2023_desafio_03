import {
  createProduct,
  createProductImages,
  deleteProduct,
  updateIsActiveProduct,
} from "@services";
import { FC, ReactNode, createContext, useCallback, useState } from "react";

interface CreateAndEditContextProviderProps {
  children: ReactNode;
}

export type Ad = {
  id?: string;
  name: string;
  description: string;
  price: number | null;
  is_new: boolean;
  accept_trade: boolean;
  payment_methods: {
    name: string;
    key: string;
  }[];
  product_images_for_delete: string[];
  product_images: {
    id?: string;
    name?: string;
    url?: string;
    uri?: string;
    type?: string;
  }[];

  user?: {
    avatar: string;
    name: string;
    tel: string;
  };
};
export type CreateAndEditContextType = {
  createAd: () => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  toogleIsActiveAd: (id: string, is_active: boolean) => Promise<void>;
  saveAd: (data: Ad) => void;
  setDeleteImage: (id: string) => void;
  ad: Ad;
};

export const CreateAndEditContext = createContext<CreateAndEditContextType>(
  {} as CreateAndEditContextType
);

export const CreateAndEditContextProvider: FC<
  CreateAndEditContextProviderProps
> = ({ children }) => {
  const [ad, setAd] = useState<Ad>({
    id: "",
    name: "",
    description: "",
    price: null,
    is_new: true,
    accept_trade: false,
    payment_methods: [],
    product_images: [],
    product_images_for_delete: [],
  });

  const createAd = useCallback(async () => {
    try {
      const priceInCents = Math.floor((ad.price as number) * 100);
      const { data } = await createProduct({
        name: ad.name,
        description: ad.description,
        price: priceInCents,
        is_new: ad.is_new,
        accept_trade: ad.accept_trade,
        payment_methods: ad.payment_methods.map((method) => method.key),
      });
      const formData = new FormData();
      formData.append("product_id", data.id);
      ad.product_images.forEach((image) =>
        formData.append("images", image as any)
      );

      await createProductImages(formData);
    } catch (error) {
      throw error;
    }
  }, [ad]);

  const saveAd = useCallback((data: Ad) => {
    setAd(data);
  }, []);

  const setDeleteImage = useCallback((id: string) => {
    setAd((oldAd) => ({
      ...oldAd,
      product_images_for_delete: [...oldAd.product_images_for_delete, id],
    }));
  }, []);

  const deleteAd = useCallback(async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }, []);

  const toogleIsActiveAd = useCallback(
    async (id: string, is_active: boolean) => {
      try {
        await updateIsActiveProduct(id, is_active);
      } catch (error) {
        throw error;
      }
    },
    []
  );
  return (
    <CreateAndEditContext.Provider
      value={{
        setDeleteImage,
        createAd,
        deleteAd,
        toogleIsActiveAd,
        saveAd,
        ad,
      }}
    >
      {children}
    </CreateAndEditContext.Provider>
  );
};

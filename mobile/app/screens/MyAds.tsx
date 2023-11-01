import { Card, Header, Icon, Screen } from "@components";
import { config } from "@config";
import { useAuth, useProducts } from "@hooks";
import { AppNavigationProps } from "@navigation";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getMyProducts } from "@services";
import { Box, FlatList, HStack, Select, Text } from "native-base";
import { useCallback, useEffect, useState } from "react";

type CardProducts = {
  id: string;
  name: string;
  price: number;
  is_new: boolean;
  thumbnail?: string;
};

export const MyAdsScreen = () => {
  const [filter, setFilter] = useState<string>("all");

  const { myAds, loadingMyAds } = useProducts();

  const { navigate } = useNavigation<AppNavigationProps<"Profile">>();
  const handleNavigateCreateAd = (id?: string) => {
    navigate("CreateAndEditAd", {
      screen: "CreateAndEdit",
      params: {
        id: id ? id : undefined,
      },
    });
  };
  const handleNavigateShowAd = (id: string) => {
    navigate("CreateAndEditAd", {
      screen: "ShowAd",
      params: { id, myAd: true },
    });
  };

  const productsFiltered = myAds.filter((product) => {
    if (filter === "all") return product;
    if (filter === "true") return product.is_new === true;
    if (filter === "false") return product.is_new === false;
  });

  if (loadingMyAds) return null;

  return (
    <Screen safeEdges={["top"]}>
      <Header
        iconRight="PlusRegular"
        title="Meus anúncios"
        onPressIconRight={handleNavigateCreateAd}
      />

      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={"7"}
        mb={"5"}
      >
        <HStack>
          {myAds.length >= 1 ? (
            <Text>{myAds.length} anúncios</Text>
          ) : (
            <Text>{myAds.length} anúncio</Text>
          )}
        </HStack>
        <Select
          selectedValue={filter}
          onValueChange={(item) => setFilter(item)}
          minW={"24"}
          height={"34px"}
          dropdownIcon={
            <Icon
              name="CaretDownRegular"
              size={16}
              mx={"2"}
              onPress={() => {}}
            />
          }
        >
          <Select.Item label="Todos" value="all" />
          <Select.Item label="Novo" value="true" />
          <Select.Item label="Usado" value="false" />
        </Select>
      </HStack>

      <FlatList
        data={productsFiltered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item, index }) => (
          <Card
            data={{ ...item, index }}
            onPress={() => handleNavigateShowAd(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <Box w={"full"} height={6} />}
      />
    </Screen>
  );
};

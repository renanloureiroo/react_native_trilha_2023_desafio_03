import { Avatar, Button, Icon, IconName, Screen } from "@components";
import { config } from "@config";
import { useCreateAndEdit, useCustomToasts, useSafeAreaEdges } from "@hooks";
import {
  AppNavigationProps,
  CreateAndEditAdNavigationProps,
  CreateAndEditAdRouteProps,
} from "@navigation";
import {
  CompositeNavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  createProductImages,
  deleteProductImages,
  updateProduct,
} from "@services";
import { AppError, formatter } from "@utils";

import {
  Box,
  FlatList,
  HStack,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
  useTheme,
} from "native-base";
import { FC, useRef, useState } from "react";
import { ViewToken, useWindowDimensions } from "react-native";

interface PreviewAdProps {}

const payments_icons: Record<string, IconName> = {
  boleto: "BarCodeRegular",
  pix: "QrCodeRegular",
  deposit: "BankRegular",
  card: "CreditCardRegular",
  cash: "MoneyRegular",
};

export const PreviewAdScreen: FC<PreviewAdProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { goBack, reset } =
    useNavigation<
      CompositeNavigationProp<
        AppNavigationProps<"CreateAndEditAd">,
        CreateAndEditAdNavigationProps<"Preview">
      >
    >();

  const { params } = useRoute<CreateAndEditAdRouteProps<"Preview">>();
  const { ad, createAd } = useCreateAndEdit();
  const { paddingTop } = useSafeAreaEdges(["top"]);
  const { width } = useWindowDimensions();
  const { colors } = useTheme();

  const { showToast } = useCustomToasts();

  const { paddingBottom } = useSafeAreaEdges(["bottom"]);

  const handleNavigateToMyAds = () => {
    reset({
      index: 0,
      routes: [{ name: "Profile" }],
    });
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index!);
      }
    }
  );

  const updateAd = async () => {
    try {
      setLoading(true);
      const priceInCents = Math.floor((ad.price as number) * 100);
      const newImagesFormatted = ad.product_images
        .filter((image) => !image.id)
        .map((image) => ({
          name: image.name,
          type: image.type,
          uri: image.uri,
        }));

      const imagesForDelete = ad.product_images_for_delete;

      await updateProduct({
        id: ad.id!,
        name: ad.name,
        description: ad.description,
        price: priceInCents,
        is_new: ad.is_new,
        accept_trade: ad.accept_trade,
        payment_methods: ad.payment_methods.map((method) => method.key),
      });

      if (newImagesFormatted.length > 0) {
        const formData = new FormData();
        formData.append("product_id", ad.id!);
        newImagesFormatted.forEach((image) => {
          formData.append("images", image as any);
        });

        await createProductImages(formData);
      }

      if (imagesForDelete.length > 0) {
        await deleteProductImages({ productImagesIds: [...imagesForDelete] });
      }
      handleNavigateToMyAds();
    } catch (error) {
      const isAxiosError = error instanceof AppError;

      const title = isAxiosError
        ? error.message
        : "Ocorreu um erro ao atualiza seu anúncio, tente novamente mais tarde!";
      showToast({
        title,
        colorScheme: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAd = async () => {
    try {
      setLoading(true);
      await createAd();
      handleNavigateToMyAds();
    } catch (error) {
      const isAxiosError = error instanceof AppError;
      const title = isAxiosError
        ? error.message
        : "Ocorreu um erro ao criar seu anúncio, tente novamente mais tarde!";

      showToast({
        title,
        colorScheme: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen safeEdges={[]} px={"0"}>
      <Box
        bg={"blue.700"}
        style={{
          paddingTop,
        }}
      >
        <Box px={"6"} py={"3"}>
          <Heading
            fontFamily={"heading"}
            color={"gray.700"}
            textAlign={"center"}
            fontSize={"md"}
          >
            Pré visualização do anúncio
          </Heading>
          <Text color={"gray.700"} fontSize={"sm"} textAlign={"center"}>
            É assim que seu produto vai aparecer!
          </Text>
        </Box>
      </Box>
      <Box position={"relative"}>
        <FlatList
          data={ad.product_images}
          keyExtractor={(item) => item.id!}
          pagingEnabled
          horizontal
          onViewableItemsChanged={onViewableItemsChanged.current}
          renderItem={({ item }) => (
            <Image
              source={{
                uri: item.uri
                  ? item.uri
                  : `${config.baseURL}/images/${item.url}`,
              }}
              alt="Alternate Text"
              w={`${width}px`}
              height={`${(width / 4) * 3}px`}
              resizeMode="cover"
            />
          )}
        />

        <HStack position={"absolute"} bottom={"2px"}>
          {ad.product_images.map((_, index) => (
            <Box
              key={index}
              flex={1}
              h={"1"}
              rounded={"full"}
              bgColor={"gray.700"}
              opacity={index === activeIndex ? 1 : 0.5}
              mx={"1"}
            />
          ))}
        </HStack>
      </Box>
      <ScrollView flex={1} mt={"3"}>
        <VStack px={"6"} flex={1} mt={5} alignItems={"flex-start"}>
          <HStack alignItems={"center"} space={2} mb={"6"}>
            <Avatar photo={ad?.user!.avatar} size={"sm"} />
            <Text>{ad.user?.name}</Text>
          </HStack>

          <Box
            bgColor={ad.is_new ? "blue.500" : "gray.200"}
            px={2}
            py={"2px"}
            rounded={"full"}
            right={1}
            top={1}
          >
            <Heading fontFamily={"heading"} color={"gray.700"} fontSize={"xs"}>
              {ad.is_new ? "Novo" : "Usado"}
            </Heading>
          </Box>
          <HStack mt={2} w={"full"} justifyContent={"space-between"}>
            <Heading fontSize={"lg"} fontFamily={"heading"} flex={1}>
              {ad.name}
            </Heading>
            <HStack alignItems={"baseline"}>
              <Heading
                fontSize={"sm"}
                fontFamily={"heading"}
                color={"blue.700"}
              >
                R$
              </Heading>
              <Heading
                ml={1}
                fontSize={"lg"}
                fontFamily={"heading"}
                color={"blue.700"}
              >
                {formatter.currency(String(ad.price!), "format", false)}
              </Heading>
            </HStack>
          </HStack>

          <Text mt={2} fontSize={"sm"} color={"gray.200"}>
            {ad.description}
          </Text>
          <HStack alignItems={"center"} space={2}>
            <Heading fontSize={"sm"} fontFamily={"heading"}>
              Aceita troca?{" "}
            </Heading>
            <Text fontSize={"sm"}>{ad.accept_trade ? "Sim" : "Não"}</Text>
          </HStack>
          <Heading fontSize={"sm"} fontFamily={"heading"} mt={4}>
            Meios de pagamento:
          </Heading>
          <VStack alignItems={"flex-start"} mt={1} mb={6}>
            {ad.payment_methods.map((payment, index) => (
              <HStack
                key={index}
                alignItems={"center"}
                space={1}
                mt={2}
                w={"full"}
              >
                <Icon
                  name={payments_icons[payment.key]}
                  size={18}
                  color={colors.gray[100]}
                />
                <Text fontSize={"sm"}>{payment.name}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
      <HStack
        space={3}
        px={6}
        pt={4}
        style={{
          paddingBottom: paddingBottom ? paddingBottom : 16,
        }}
      >
        <Button
          text="Voltar e editar"
          leftIcon={
            <Icon size={16} name="ArroLeftRegular" color={colors.gray[200]} />
          }
          variant="gray"
          disabled={loading}
          onPress={goBack}
        />
        <Button
          text="Publicar"
          leftIcon={
            <Icon size={16} name="TagRegular" color={colors.gray[600]} />
          }
          variant="blue"
          isLoading={loading}
          onPress={params.create ? handleCreateAd : updateAd}
        />
      </HStack>
    </Screen>
  );
};

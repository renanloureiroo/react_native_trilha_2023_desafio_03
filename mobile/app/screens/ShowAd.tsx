import { Header, Screen, Avatar, IconName, Icon, Button } from "@components";
import { config } from "@config";
import { useCreateAndEdit, useCustomToasts, useSafeAreaEdges } from "@hooks";
import {
  AppNavigationProps,
  AppRouteProps,
  CreateAndEditAdNavigationProps,
  CreateAndEditAdRouteProps,
} from "@navigation";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Product, getProductById } from "@services";
import { AppError, formatter } from "@utils";
import {
  Box,
  Center,
  FlatList,
  HStack,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
  useTheme,
} from "native-base";
import { useCallback, useEffect, useRef, useState } from "react";
import { ViewToken, useWindowDimensions } from "react-native";

const payments_icons: Record<string, IconName> = {
  boleto: "BarCodeRegular",
  pix: "QrCodeRegular",
  deposit: "BankRegular",
  card: "CreditCardRegular",
  cash: "MoneyRegular",
};

export const ShowAdScreen = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [product, setProduct] = useState<Product>({} as Product);

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [toogleActiveAdLoading, setToogleActiveAdLoading] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { params } = useRoute<CreateAndEditAdRouteProps<"ShowAd">>();
  const { goBack, navigate } =
    useNavigation<CreateAndEditAdNavigationProps<"ShowAd">>();

  const { showToast } = useCustomToasts();
  const { colors } = useTheme();

  const { saveAd, deleteAd, toogleIsActiveAd } = useCreateAndEdit();

  const { myAd } = params;

  const { width } = useWindowDimensions();
  const { paddingBottom } = useSafeAreaEdges(["bottom"]);
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index!);
      }
    }
  );

  const handleDeleteAd = async () => {
    try {
      setDeleteLoading(true);
      await deleteAd(params.id);
      goBack();
    } catch (error) {
      const isAxiosError = error instanceof AppError;

      const title = isAxiosError ? error.message : "Erro ao excluir anúncio";

      showToast({
        title,
        colorScheme: "danger",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToogleIsActiveAd = async () => {
    try {
      setToogleActiveAdLoading(true);
      // optimistic ui update
      setProduct((oldProduct) => ({
        ...oldProduct,
        is_active: !oldProduct.is_active,
      }));

      await toogleIsActiveAd(params.id, !product.is_active);
    } catch (error) {
      const isAxiosError = error instanceof AppError;

      const title = isAxiosError
        ? error.message
        : "Erro ao desativar/ativar anúncio";

      showToast({
        title,
        colorScheme: "danger",
      });
    } finally {
      setToogleActiveAdLoading(false);
    }
  };

  const fecthProduct = async () => {
    try {
      const { data } = await getProductById(params.id);

      setProduct(data);

      saveAd({
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price / 100,
        is_new: data.is_new,
        accept_trade: data.accept_trade,
        //@ts-ignore
        payment_methods: data.payment_methods,
        //@ts-ignore
        product_images: data.product_images.map((image) => ({
          id: image.id,
          name: image.path,
          url: image.path,
        })),
        product_images_for_delete: [],
        user: {
          name: data.user.name,
          avatar: `${config.baseURL}/images/${data.user.avatar}`,
          tel: data.user.tel,
        },
      });
    } catch (error) {
      showToast({
        title: "Erro ao carregar anúncio",
        colorScheme: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fecthProduct();
    }, [params.id])
  );

  if (loading) {
    return null;
  }

  return (
    <Screen safeEdges={["top"]} px={0}>
      <Header
        iconLeft="ArroLeftRegular"
        onPressIconLeft={goBack}
        onPressIconRight={() => navigate("CreateAndEdit", { id: params.id })}
        iconRight={myAd ? "PencilSimpleLineRegular" : undefined}
        px={"6"}
      />

      <Box position={"relative"}>
        <FlatList
          data={product.product_images}
          keyExtractor={(item) => item.id}
          pagingEnabled
          horizontal
          onViewableItemsChanged={onViewableItemsChanged.current}
          renderItem={({ item }) => (
            <Image
              source={{
                uri: `${config.baseURL}/images/${item.path}`,
              }}
              alt="Alternate Text"
              w={`${width}px`}
              height={`${(width / 4) * 3}px`}
              resizeMode="cover"
            />
          )}
        />

        <HStack position={"absolute"} bottom={"2px"}>
          {product.product_images.map((_, index) => (
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

        {!product.is_active && (
          <Center
            position={"absolute"}
            top={0}
            bottom={0}
            right={0}
            left={0}
            bg={"gray.100:alpha.60"}
          >
            <Heading fontFamily={"heading"} fontSize={"sm"} color={"gray.700"}>
              Anúncio pausado
            </Heading>
          </Center>
        )}
      </Box>
      <ScrollView flex={1} mt={"3"}>
        <VStack px={"6"} flex={1} mt={5} alignItems={"flex-start"}>
          <HStack alignItems={"center"} space={2} mb={"6"}>
            <Avatar
              photo={`${config.baseURL}/images/${product.user.avatar}`}
              size={"sm"}
            />
            <Text>{product.user.name}</Text>
          </HStack>

          <Box
            bgColor={product.is_new ? "blue.500" : "gray.200"}
            px={2}
            py={"2px"}
            rounded={"full"}
            right={1}
            top={1}
          >
            <Heading fontFamily={"heading"} color={"gray.700"} fontSize={"xs"}>
              {product.is_new ? "Novo" : "Usado"}
            </Heading>
          </Box>
          <HStack mt={2} w={"full"} justifyContent={"space-between"}>
            <Heading fontSize={"lg"} fontFamily={"heading"} flex={1}>
              {product.name}
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
                {formatter.currency(
                  String(product.price / 100),
                  "format",
                  false
                )}
              </Heading>
            </HStack>
          </HStack>

          <Text mt={2} fontSize={"sm"} color={"gray.200"}>
            {product.description}
          </Text>
          <HStack alignItems={"center"} space={2}>
            <Heading fontSize={"sm"} fontFamily={"heading"}>
              Aceita troca?{" "}
            </Heading>
            <Text fontSize={"sm"}>{product.accept_trade ? "Sim" : "Não"}</Text>
          </HStack>
          <Heading fontSize={"sm"} fontFamily={"heading"} mt={4}>
            Meios de pagamento:
          </Heading>
          <VStack alignItems={"flex-start"} mt={1} mb={6}>
            {product.payment_methods.map((payment) => (
              <HStack
                key={payment.key}
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

      {!myAd ? (
        <HStack
          w={"full"}
          px={"6"}
          bg={"gray.700"}
          pt={"5"}
          position={"absolute"}
          bottom={0}
          alignItems={"center"}
          style={{
            paddingBottom:
              Number(paddingBottom) === 0 ? 16 : Number(paddingBottom),
          }}
        >
          <HStack alignItems={"baseline"} flex={1}>
            <Heading fontSize={"md"} fontFamily={"heading"} color={"blue.500"}>
              R$
            </Heading>
            <Heading
              ml={1}
              fontSize={"xl"}
              fontFamily={"heading"}
              color={"blue.500"}
            >
              {formatter.currency(String(product.price / 100), "format", false)}
            </Heading>
          </HStack>
          <Button
            text="Entrar em contato"
            leftIcon={
              <Icon
                name={"WhatsAppLogoFill"}
                size={16}
                color={colors.gray[700]}
              />
            }
            variant="blue"
          />
        </HStack>
      ) : (
        <VStack
          position={"absolute"}
          bottom={0}
          w={"full"}
          px={"6"}
          pt={"5"}
          style={{
            paddingBottom:
              Number(paddingBottom) === 0 ? 16 : Number(paddingBottom),
          }}
        >
          <Button
            text={product.is_active ? "Desativar anúncio" : "Reativar anúnico"}
            leftIcon={
              <Icon name={"PowerRegular"} size={16} color={colors.gray[700]} />
            }
            mb={"2"}
            variant={product.is_active ? "black" : "blue"}
            onPress={handleToogleIsActiveAd}
            isLoading={toogleActiveAdLoading}
          />
          <Button
            text="Excluir anúncio"
            leftIcon={
              <Icon
                name={"TrashSimpleRegular"}
                size={16}
                color={colors.gray[100]}
              />
            }
            variant="gray"
            isLoading={deleteLoading}
            onPress={handleDeleteAd}
          />
        </VStack>
      )}
    </Screen>
  );
};

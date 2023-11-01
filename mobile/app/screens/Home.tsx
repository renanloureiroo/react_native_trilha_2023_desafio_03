import {
  Avatar,
  Button,
  Card,
  CheckBox,
  Icon,
  Input,
  Screen,
  Tag,
} from "@components";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Box,
  Divider,
  FlatList,
  HStack,
  Heading,
  Pressable,
  Switch,
  Text,
  VStack,
  useTheme,
} from "native-base";
import { useAuth, useProducts, useSafeAreaEdges } from "@hooks";

import { getAllProducts } from "@services";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigationProps } from "@navigation";
import { config } from "@config";

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type CardProducts = {
  id: string;
  name: string;
  price: number;
  is_new: boolean;
  accept_trade: boolean;
  thumbnail: string;
  avatar: string;
  payment_methods: PaymentMethods[];
};

type PaymentMethods = "pix" | "card" | "cash" | "deposit" | "boleto";

const initialState = {
  payment_methods: ["pix", "card", "cash", "deposit", "boleto"],
  condition: {
    novo: true,
    usado: true,
  },
  accept_trade: false,
};

const schema = z.object({
  payment_methods: z.array(z.string().optional()),
  condition: z.object({
    novo: z.boolean().optional(),
    usado: z.boolean().optional(),
  }),
  accept_trade: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export const HomeScreen = () => {
  const [bottomSheetOpen, setBottomSheetOpen] = useState<boolean>(false);
  const [ads, setAds] = useState<CardProducts[]>([]);

  const { loadingMyAds, myAds } = useProducts();
  const { colors } = useTheme();
  const [search, setSeach] = useState<string>("");

  const [filters, setFilters] = useState<FormData>(initialState);

  const { control, setValue, getValues, watch, reset, handleSubmit } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: filters,
    });
  const { paddingBottom } = useSafeAreaEdges(["bottom"]);

  const { user } = useAuth();

  const { navigate } = useNavigation<AppNavigationProps<"Home">>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const fecthProducts = async () => {
    try {
      const { data } = await getAllProducts();

      const formattedData = data.map(
        ({
          id,
          name,
          is_new,
          product_images,
          accept_trade,
          price,
          user,
          payment_methods,
        }) => ({
          id,
          name,
          price,
          is_new,
          accept_trade,
          thumbnail: `${config.baseURL}/images/${product_images[0].path}`,
          avatar: `${config.baseURL}/images/${user.avatar}`,
          payment_methods: payment_methods.map(
            (item) => item.key
          ) as unknown as PaymentMethods[],
        })
      );
      setAds(formattedData as CardProducts[]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateToShowAd = (id: string) => {
    navigate("CreateAndEditAd", {
      screen: "ShowAd",
      params: { id },
    });
  };

  const handleNavigateToMyAds = () => {
    navigate("Profile");
  };

  const handlePaymentMethods = (value: string) => {
    const methods = getValues("payment_methods");
    const newMethods = methods.includes(value)
      ? methods.filter((method) => method !== value)
      : [...methods, value];

    setValue("payment_methods", newMethods);
  };

  const formValues = watch();

  const updatedFilter = (data: FormData) => {
    setFilters(data);
    setValue("accept_trade", data.accept_trade);
    setValue("condition", data.condition);
    setValue("payment_methods", data.payment_methods);
  };

  const onSubmit = (data: FormData) => {
    bottomSheetModalRef.current?.close();
    updatedFilter(data);
  };

  const name = user.name.split(" ")[0];
  const producstFiltred = ads
    .filter((item) => {
      let hasPaymentMethod = false;

      for (const method of item.payment_methods) {
        if (filters.payment_methods.includes(method)) {
          hasPaymentMethod = true;
        }
      }
      return hasPaymentMethod;
    })
    .filter((item) => item.accept_trade === filters.accept_trade)
    .filter((item) => {
      let hasCondition = false;

      if (filters.condition.novo && item.is_new) {
        hasCondition = true;
      }

      if (filters.condition.usado && !item.is_new) {
        hasCondition = true;
      }

      return hasCondition;
    })
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    fecthProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!bottomSheetOpen) {
        updatedFilter(filters);
      }
    }, [bottomSheetOpen])
  );

  return (
    <Screen safeEdges={["top"]} px={"0"}>
      <HStack alignItems={"center"} space={"2"} mt={"5"} mb={"8"} px={"6"}>
        <Avatar photo={user.avatar} size={"md"} mr={"2px"} />
        <Box flex={1}>
          <Text fontSize={"md"}>Boas vindas,</Text>
          <Heading fontSize={"md"} fontFamily={"heading"}>
            {name}!
          </Heading>
        </Box>
        <Button
          text="Criar anúncio"
          leftIcon={
            <Icon size={16} color={colors.gray[600]} name="PlusRegular" />
          }
          onPress={() => {
            navigate("CreateAndEditAd", {
              screen: "CreateAndEdit",
              params: {},
            });
          }}
        />
      </HStack>
      <VStack px={"6"}>
        <Text color={"gray.300"} fontSize={"sm"} mb={3}>
          Seus produtos anunciados para venda
        </Text>
        <Pressable
          _android={{
            android_ripple: {
              color: colors.gray[600],
            },
          }}
          _ios={{
            _pressed: {
              opacity: 0.7,
            },
          }}
          onPress={handleNavigateToMyAds}
        >
          <HStack
            alignItems={"center"}
            bgColor={"rgba(100,122, 199,0.1)"}
            px="4"
            py="3"
            rounded={"md"}
            mb={8}
          >
            <Icon name="TagRegular" color={colors.blue[500]} size={22} />

            <Box flex={1} ml={4}>
              <Heading
                fontSize={"lg"}
                fontFamily={"heading"}
                color={"gray.200"}
              >
                {loadingMyAds ? "" : myAds.length}
              </Heading>
              <Text>anúncios ativos</Text>
            </Box>

            <HStack space={"2"}>
              <Heading fontSize={"xs"} color={"blue.500"}>
                Meus anúncios
              </Heading>
              <Icon
                name="ArroRightRegular"
                color={colors.blue[500]}
                size={16}
              />
            </HStack>
          </HStack>
        </Pressable>
      </VStack>
      <VStack px={"6"}>
        <Text color={"gray.300"} fontSize={"sm"} mb={3}>
          Compre produtos variados
        </Text>
        <Input
          value={search}
          onChangeText={(value) => setSeach(value)}
          placeholder="Buscar anúncio"
          mb={"6"}
          rightElement={
            <HStack mr={4}>
              <Icon
                name="MagnifyingGlassRegular"
                color={colors.gray[200]}
                size={20}
              />

              <Divider
                orientation="vertical"
                bg={"gray.400"}
                mx={3}
                height={"20px"}
                thickness="1"
              />

              <Icon
                name="SlidersRegular"
                color={colors.gray[200]}
                size={20}
                onPress={handlePresentModalPress}
              />
            </HStack>
          }
        />
      </VStack>

      <FlatList
        data={producstFiltred}
        keyExtractor={(item) => item.id}
        numColumns={2}
        _contentContainerStyle={{
          px: "6",
        }}
        renderItem={({ item, index }) => (
          <Card
            data={{ ...item, index }}
            onPress={() => handleNavigateToShowAd(item.id)}
            showAvatar
          />
        )}
        ItemSeparatorComponent={() => <Box w={"full"} height={6} />}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={(index) => setBottomSheetOpen(index === -1)}
        handleIndicatorStyle={{
          backgroundColor: colors.gray[400],
          height: 4,
          width: 59,
          borderRadius: 2,
        }}
      >
        <BottomSheetScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 24,
          }}
        >
          <HStack alignItems={"center"} justifyContent={"space-between"} mb={6}>
            <Heading fontFamily={"bold"} fontSize={"lg"}>
              Filtrar anúncios
            </Heading>

            <Icon
              size={24}
              color={colors.gray[400]}
              name="XRegular"
              onPress={() => bottomSheetModalRef.current?.close()}
            />
          </HStack>
          <Heading
            color={"gray.200"}
            fontFamily={"bold"}
            fontSize={"sm"}
            mb={"3"}
          >
            Condição
          </Heading>

          <HStack space={2} mb={"6"}>
            <Controller
              control={control}
              name="condition.novo"
              render={({ field: { onChange, value } }) => (
                <Tag
                  text="Novo"
                  selected={!!value}
                  onPress={() => onChange(!value)}
                />
              )}
            />

            <Controller
              control={control}
              name="condition.usado"
              render={({ field: { onChange, value } }) => (
                <Tag
                  text="Usado"
                  selected={!!value}
                  onPress={() => onChange(!value)}
                />
              )}
            />
          </HStack>
          <Heading
            fontFamily={"heading"}
            fontSize={"md"}
            color={"gray.200"}
            mb={"3"}
          >
            Aceita troca
          </Heading>
          <HStack justifyContent={"flex-start"}>
            <Controller
              control={control}
              name="accept_trade"
              render={({ field: { onChange, value } }) => (
                <Switch
                  onTrackColor={"blue.700"}
                  value={value}
                  onToggle={() => onChange(!value)}
                />
              )}
            />
          </HStack>

          <VStack color={"gray.200"} space={"2"} mt={"4"}>
            <Heading fontFamily={"bold"} fontSize={"sm"} mb={"3"}>
              Meios de pagamento aceitos
            </Heading>
            <CheckBox
              isChecked={formValues.payment_methods.includes("boleto")}
              onChange={() => handlePaymentMethods("boleto")}
              value="boleto"
            >
              Boleto
            </CheckBox>
            <CheckBox
              isChecked={formValues.payment_methods.includes("pix")}
              onChange={() => handlePaymentMethods("pix")}
              value="pix"
            >
              Pix
            </CheckBox>
            <CheckBox
              isChecked={formValues.payment_methods.includes("cash")}
              onChange={() => handlePaymentMethods("cash")}
              value="cash"
            >
              Dinheiro
            </CheckBox>
            <CheckBox
              isChecked={formValues.payment_methods.includes("card")}
              onChange={() => handlePaymentMethods("card")}
              value="card"
            >
              Cartão de Crédito
            </CheckBox>
            <CheckBox
              isChecked={formValues.payment_methods.includes("deposit")}
              onChange={() => handlePaymentMethods("deposit")}
              value="deposit"
            >
              Depósito Bancário
            </CheckBox>
          </VStack>
        </BottomSheetScrollView>
        <HStack
          py={"4"}
          px={"6"}
          space={3}
          style={{
            marginBottom:
              Number(paddingBottom) === 0 ? 16 : Number(paddingBottom),
          }}
        >
          <Button
            text="Resetar filtros"
            variant="gray"
            onPress={() => {
              bottomSheetModalRef.current?.close();
              setFilters(initialState);
              reset();
            }}
          />
          <Button text="Aplicar filtros" onPress={handleSubmit(onSubmit)} />
        </HStack>
      </BottomSheetModal>
    </Screen>
  );
};

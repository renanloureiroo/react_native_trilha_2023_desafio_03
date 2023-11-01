import {
  Button,
  CheckBox,
  Header,
  Icon,
  Input,
  Radio,
  Screen,
} from "@components";
import {
  HStack,
  Heading,
  Pressable,
  Radio as NBRadio,
  Text,
  TextArea,
  VStack,
  useTheme,
  Box,
  Switch,
  Image,
} from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { formatter } from "@utils";
import { useState } from "react";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuth, useCreateAndEdit, useCustomToasts } from "@hooks";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  CreateAndEditAdNavigationProps,
  CreateAndEditAdRouteProps,
} from "@navigation";
import { config } from "@config";
import { Ad } from "@contexts";

const schema = z.object({
  name: z.string(),
  description: z.string(),
  is_new: z.string().transform((val) => val === "true"),
  price: z
    .number()
    .nullable()
    .transform((val) => (val ? val : null)),
  accept_trade: z.boolean(),
  payment_methods: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
    })
  ),
});

type FormData = z.infer<typeof schema>;

export const CreateAdScreen = () => {
  const { ad, saveAd, setDeleteImage } = useCreateAndEdit();
  const { user } = useAuth();

  const { colors } = useTheme();

  const { navigate, goBack } =
    useNavigation<CreateAndEditAdNavigationProps<"CreateAndEdit">>();
  const { params } = useRoute<CreateAndEditAdRouteProps<"CreateAndEdit">>();

  const [images, setImages] = useState<
    {
      id?: string;
      name?: string;
      url?: string;
      uri?: string;
      type?: string;
    }[]
  >(ad.product_images);

  const { control, handleSubmit, getValues, setValue, watch } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: ad.name,
        description: ad.description,
        //@ts-ignore
        is_new: String(ad.is_new),
        price: ad.price,
        accept_trade: ad.accept_trade,
        payment_methods: ad.payment_methods,
      },
    });

  const { showToast } = useCustomToasts();

  const handlePickImage = async () => {
    try {
      const status = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!status.granted) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.8,
      });

      if (result.canceled) return;

      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri, {
        size: true,
      });

      if (!fileInfo.exists) return;

      if (fileInfo.size / 1024 / 1024 > 5) {
        return showToast({
          title: "Selecione uma image com o tamanho máximo de 5MB",
          colorScheme: "danger",
        });
      }
      const fileExtension = result.assets[0].uri.split(".").pop();

      const file = {
        name: `${new Date().getTime()}.${fileExtension}`,
        uri: result.assets[0].uri,
        type: `${result.assets[0].type}/${fileExtension}`,
      };

      setImages(() => [...images, file]);
    } catch (error) {
      showToast({
        title: "Ocorreu um erro ao selecionar a imagem.",
        colorScheme: "danger",
      });
    }
  };

  const onSubmit = async ({
    accept_trade,
    description,
    is_new,
    payment_methods,
    price,
    name,
  }: FormData) => {
    saveAd({
      id: ad.id,
      accept_trade,
      description,
      is_new,
      payment_methods,
      price,
      name,
      product_images: images,
      user: params?.id
        ? {
            avatar: ad.user!.avatar,
            name: ad.user!.name,
            tel: ad.user!.tel,
          }
        : {
            name: user.name,
            tel: user.tel,
            avatar: user.avatar!,
          },
      product_images_for_delete: ad.product_images_for_delete,
    });
    navigate("Preview", {
      create: params?.id ? false : true,
    });
  };

  const handleCancel = () => {
    goBack();
    saveAd({} as Ad);
  };

  const handlePaymentMethods = (item: { key: string; name: string }) => {
    const methods = getValues("payment_methods");
    const hasExists = methods.find((method) => method.key === item.key);

    let newMethods = [];

    if (!hasExists) {
      newMethods = [...methods, item];
    } else {
      newMethods = methods.filter((method) => method.key !== item.key);
    }

    setValue("payment_methods", newMethods);
  };

  const handleRemoveImage = (image: string) => {
    const imageIndex = images.findIndex((img) => img.name === image);

    if (images[imageIndex].id) {
      setDeleteImage(images[imageIndex].id!);
    }
    const newImages = images.filter((img) => img.name !== image);
    setImages(newImages);
  };

  const formValues = watch();

  const paymentMethodsKey = formValues.payment_methods.map((item) => item.key);

  return (
    <Screen safeEdges={["top"]} px={"0"}>
      <Header
        iconLeft="ArroLeftRegular"
        title="Criar anúncio"
        px={"6"}
        onPressIconLeft={goBack}
      />
      <KeyboardAwareScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingTop: 32,
        }}
      >
        <VStack px={"6"} mb={"6"}>
          <Heading fontFamily={"heading"} fontSize={"md"} color={"gray.200"}>
            Imagens
          </Heading>
          <Text fontFamily={"body"} color={"gray.300"} fontSize={"sm"}>
            Escolha até 3 imagens para mostrar o quando o seu produto é
            incrível!
          </Text>
          <HStack mt={"4"} mb={"7"} space={"2"}>
            {images?.map((image) => (
              <Box
                key={image.name}
                rounded={"6px"}
                overflow={"hidden"}
                position={"relative"}
              >
                <Image
                  source={{
                    uri: image.uri
                      ? image.uri
                      : `${config.baseURL}/images/${image.url}`,
                  }}
                  alt={"Image"}
                  width={"100px"}
                  height={"100px"}
                />
                <Box
                  position={"absolute"}
                  right={"1"}
                  top={"1"}
                  bg={"gray.700"}
                  w={"5"}
                  h={"5"}
                  overflow={"hidden"}
                  rounded={"full"}
                >
                  <Icon
                    size={24}
                    name="XCircleFill"
                    color={colors.gray[200]}
                    onPress={() => handleRemoveImage(image?.name as string)}
                  />
                </Box>
              </Box>
            ))}
            {images?.length < 3 && (
              <Pressable
                android_ripple={{
                  color: colors.blue[700],
                  foreground: true,
                }}
                _pressed={{
                  opacity: 0.7,
                }}
                bg={"gray.500"}
                rounded={"6px"}
                w={"100px"}
                height={"100px"}
                overflow={"hidden"}
                alignItems={"center"}
                justifyContent={"center"}
                onPress={handlePickImage}
              >
                <Icon name="PlusRegular" color={colors.gray[400]} size={24} />
              </Pressable>
            )}
          </HStack>

          <VStack space={"4"} mb={"7"}>
            <Heading fontFamily={"heading"} fontSize={"md"} color={"gray.200"}>
              Sobre o produto
            </Heading>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Título do produto"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  placeholder="Descrição do produto"
                  autoCompleteType={{}}
                  px={"4"}
                  py={"3"}
                  fontSize={"md"}
                  placeholderTextColor={"gray.400"}
                  color={"gray.200"}
                  bg="gray.700"
                  borderColor={"transparent"}
                  _focus={{
                    bg: "gray.700s",
                    borderColor: "gray.100",
                  }}
                  _invalid={{
                    _focus: {
                      borderColor: "red.400",
                    },
                  }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            <Box h={"6"} w={"full"}>
              <Controller
                control={control}
                name="is_new"
                render={({ field: { onChange, value } }) => (
                  <NBRadio.Group
                    w={"full"}
                    name="productType"
                    flexDirection={"row"}
                    flex={1}
                    value={String(value)}
                    onChange={onChange}
                  >
                    <HStack space={4} w={"full"}>
                      <Box flex={1}>
                        <Radio value="true">Produto novo</Radio>
                      </Box>
                      <Box flex={1}>
                        <Radio value="false">Produto usado</Radio>
                      </Box>
                    </HStack>
                  </NBRadio.Group>
                )}
              />
            </Box>
          </VStack>

          <VStack space={"4"}>
            <Heading fontFamily={"heading"} fontSize={"md"} color={"gray.200"}>
              Venda
            </Heading>

            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  placeholder="Valor do produto"
                  pl="0"
                  leftElement={
                    <Text ml={"4"} mr="2" fontSize={"md"}>
                      R$
                    </Text>
                  }
                  onChangeText={(value) =>
                    onChange(formatter.currency(value, "unformat"))
                  }
                  onBlur={onBlur}
                  value={
                    value
                      ? String(
                          formatter.currency(String(value), "format", false)
                        )
                      : ""
                  }
                  keyboardType="numeric"
                />
              )}
            />

            <Box>
              <Heading
                fontFamily={"heading"}
                fontSize={"md"}
                color={"gray.200"}
                mb={"3"}
              >
                Aceita troca
              </Heading>
              <Box flexDirection={"row"}>
                <Controller
                  control={control}
                  name="accept_trade"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      onTrackColor={"blue.700"}
                      value={value}
                      onToggle={onChange}
                    />
                  )}
                />
              </Box>
            </Box>

            <Box>
              <Heading
                fontFamily={"heading"}
                fontSize={"md"}
                color={"gray.200"}
                mb={"3"}
              >
                Meios de pagamento
              </Heading>
              <Controller
                control={control}
                name="payment_methods"
                render={({ field: {} }) => (
                  <VStack space={"2"}>
                    <CheckBox
                      isChecked={paymentMethodsKey.includes("boleto")}
                      onChange={() =>
                        handlePaymentMethods({
                          key: "boleto",
                          name: "Boleto",
                        })
                      }
                      value="boleto"
                    >
                      Boleto
                    </CheckBox>
                    <CheckBox
                      isChecked={paymentMethodsKey.includes("pix")}
                      onChange={() =>
                        handlePaymentMethods({
                          key: "pix",
                          name: "Pix",
                        })
                      }
                      value="pix"
                    >
                      Pix
                    </CheckBox>
                    <CheckBox
                      isChecked={paymentMethodsKey.includes("cash")}
                      onChange={() =>
                        handlePaymentMethods({ key: "cash", name: "Dinheiro" })
                      }
                      value="cash"
                    >
                      Dinheiro
                    </CheckBox>
                    <CheckBox
                      isChecked={paymentMethodsKey.includes("card")}
                      onChange={() =>
                        handlePaymentMethods({
                          key: "card",
                          name: "Cartão de Crédito",
                        })
                      }
                      value="card"
                    >
                      Cartão de Crédito
                    </CheckBox>
                    <CheckBox
                      isChecked={paymentMethodsKey.includes("deposit")}
                      onChange={() =>
                        handlePaymentMethods({
                          key: "deposit",
                          name: "Depósito Bancário",
                        })
                      }
                      value="deposit"
                    >
                      Depósito Bancário
                    </CheckBox>
                  </VStack>
                )}
              />
            </Box>
          </VStack>
        </VStack>
        <HStack space={"3"} px={"6"} py={"5"} bg={"gray.700"} safeAreaBottom>
          <Button text="Cancelar" variant="gray" onPress={handleCancel} />
          <Button text="Avançar" onPress={handleSubmit(onSubmit)} />
        </HStack>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

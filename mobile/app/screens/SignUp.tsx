import { Input, Screen, Icon, Button, Avatar } from "@components";
import { Heading, Image, Text, VStack, useTheme, useToast } from "native-base";
import Logo from "../assets/imagens/logo.png";

import { useRef, useState } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Controller, useForm } from "react-hook-form";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppError, formatter, validator } from "@utils";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { createAccount } from "@services";
import { useAuth } from "@hooks";
import { Platform, TextInput } from "react-native";

const schema = zod
  .object({
    name: zod.string({
      required_error: "Nome é obrigatório",
      invalid_type_error: "Nome precisa ser uma string",
    }),
    email: zod
      .string({
        required_error: "E-mail é obrigatório",
      })
      .email({
        message: "E-mail inválido",
      }),
    phone: zod
      .string({
        required_error: "Telefone é obrigatório",
      })
      .refine(validator.isPhoneNumber, {
        message: "Número inválido",
      })
      .transform((value) => formatter.phone(value, "unformat")),

    password: zod
      .string({
        required_error: "Senha é obrigatória",
      })
      .min(6, "A senha precisa ter  no mínimo 6 caracteres"),
    confirm_password: zod.string({
      required_error: "Confirmação de senha é obrigatória",
    }),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Senhas não são iguails",
      });
    }
  });

type FormData = zod.infer<typeof schema>;

export const SignUpScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [image, setImage] = useState<{
    name: string;
    uri: string;
    type: string;
  }>({
    name: "",
    uri: "",
    type: "",
  });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isVisible2, setIsVisible2] = useState<boolean>(false);

  const inputEmailRef = useRef<TextInput>(null);
  const inputPhoneRef = useRef<TextInput>(null);
  const inputPasswordRef = useRef<TextInput>(null);
  const inputConfirmPasswordRef = useRef<TextInput>(null);

  const { colors } = useTheme();

  const { show } = useToast();

  const { signIn } = useAuth();

  const handlePickImage = async () => {
    try {
      const status = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!status.granted) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (result.canceled) return;

      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri, {
        size: true,
      });

      if (!fileInfo.exists) return;

      if (fileInfo.size / 1024 / 1024 > 5) {
        return show({
          title: "Selecione uma image com o tamanho máximo de 5MB",
          placement: "top",
          bgColor: "red.400",
          _text: {
            fontSize: "md",
            fontFamily: "heading",
          },
        });
      }
      const fileExtension = result.assets[0].uri.split(".").pop();

      const file = {
        name: `${new Date().getTime()}.${fileExtension}`,
        uri: result.assets[0].uri,
        type: `${result.assets[0].type}/${fileExtension}`,
      };

      setImage(file);
    } catch (error) {
      show({
        title: "Ocorreu um erro ao selecionar a imagem.",
        placement: "top",
        bgColor: "red.400",
        _text: {
          fontSize: "md",
          fontFamily: "heading",
        },
      });
    }
  };

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formValues: FormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      console.log(image);
      formData.append("avatar", image as any);
      formData.append("name", formValues.name);
      formData.append("email", formValues.email);
      formData.append("tel", `+55${formValues.phone}`);
      formData.append("password", formValues.password);
      await createAccount(formData);
      await signIn({
        email: formValues.email,
        password: formValues.password,
      });
    } catch (error) {
      const isAxiosError = error instanceof AppError;
      console.log;
      const title = isAxiosError
        ? error.message
        : "Ocorreu um erro ao criar sua conta, tente novamente mais tarde!";

      show({
        title,
        placement: "top",
        bgColor: "red.400",
        _text: {
          fontSize: "md",
          fontFamily: "heading",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen safeEdges={["bottom", "top"]} px={0}>
      <KeyboardAwareScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: 48,
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <Image
          alt="Logo da aplicação"
          defaultSource={Logo}
          source={Logo}
          resizeMode="contain"
          w={16}
          h={10}
          mb={3}
        />
        <Heading fontSize={"lg"} textAlign={"center"} fontFamily={"heading"}>
          Boas vindas!
        </Heading>
        <Text textAlign={"center"} fontSize={"sm"} mb={7}>
          Crie sua conta e use o espaço para comprar itens variados e vender
          seus produtos
        </Text>

        <Avatar isPicker photo={image.uri} onPress={handlePickImage} mb={4} />

        <VStack w={"full"} alignItems={"center"} space={4}>
          <Controller
            control={control}
            name="name"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Input
                placeholder="Nome"
                autoCapitalize="words"
                autoCorrect={false}
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                isInvalid={!!error}
                errorMessage={error?.message}
                isReadOnly={isLoading}
                onSubmitEditing={() => inputEmailRef.current?.focus()}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Input
                ref={inputEmailRef}
                placeholder="Email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                isInvalid={!!error}
                errorMessage={error?.message}
                isReadOnly={isLoading}
                onSubmitEditing={() => inputPhoneRef.current?.focus()}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Input
                ref={inputPhoneRef}
                placeholder="Telefone"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                onBlur={onBlur}
                value={formatter.phone(value)}
                onChangeText={(value) => onChange(value)}
                isInvalid={!!error}
                errorMessage={error?.message}
                maxLength={18}
                isReadOnly={isLoading}
                onSubmitEditing={() => inputPasswordRef.current?.focus()}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Input
                ref={inputPasswordRef}
                placeholder="Senha"
                secureTextEntry={!isVisible}
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                isInvalid={!!error}
                errorMessage={error?.message}
                isReadOnly={isLoading}
                InputRightElement={
                  <Icon
                    name={!isVisible ? "EyeRegular" : "EyeSlashRegular"}
                    color={colors.gray[300]}
                    size={20}
                    style={{
                      marginHorizontal: 16,
                    }}
                    onPress={() => setIsVisible((s) => !s)}
                  />
                }
                onSubmitEditing={() => inputConfirmPasswordRef.current?.focus()}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <Input
                ref={inputConfirmPasswordRef}
                placeholder="Confirmar senha"
                secureTextEntry={!isVisible2}
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                isInvalid={!!error}
                errorMessage={error?.message}
                isReadOnly={isLoading}
                InputRightElement={
                  <Icon
                    name={!isVisible2 ? "EyeRegular" : "EyeSlashRegular"}
                    color={colors.gray[300]}
                    size={20}
                    style={{
                      marginHorizontal: 16,
                    }}
                    onPress={() => setIsVisible2((s) => !s)}
                  />
                }
              />
            )}
          />
          <Button
            text="Criar"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />
        </VStack>

        <VStack w={"full"} space={4} alignItems={"center"} pt={12} pb={10}>
          <Text>Já tem uma conta?</Text>

          <Button
            text="Ir para o login"
            variant="gray"
            isDisabled={isLoading}
          />
        </VStack>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

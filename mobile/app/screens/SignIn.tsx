import { Input, Screen, Icon, Button } from "@components";
import {
  Box,
  Flex,
  Image,
  ScrollView,
  Text,
  VStack,
  useTheme,
  Input as NBInput,
  useToast,
} from "native-base";
import Logo from "../assets/imagens/logo.png";
import MarketSpace from "../assets/imagens/marketspace.png";
import { useEffect, useRef, useState } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { AuthStackNavigationProps } from "@navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, TextInput, useWindowDimensions } from "react-native";
import { useAuth, useCustomToasts } from "@hooks";
import { AppError } from "@utils";

const schema = z.object({
  email: z
    .string({
      required_error: "E-mail é obrigatório",
    })
    .email({
      message: "E-mail inválido",
    }),
  password: z.string({
    required_error: "Senha é obrigatória",
  }),
});

type FormData = z.infer<typeof schema>;

export const SignInScreen = () => {
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const passwordRef = useRef<TextInput>(null);
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const { showToast } = useCustomToasts();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { navigate } = useNavigation<AuthStackNavigationProps<"SignIn">>();
  const { height } = useWindowDimensions();

  const handleNavigateToSignUpScreen = () => {
    navigate("SignUp");
  };

  const onSubmit = async ({ email, password }: FormData) => {
    Keyboard.dismiss();
    setIsLogging(true);
    try {
      await signIn({
        email,
        password,
      });
    } catch (error) {
      const isAxiosError = error instanceof AppError;

      const title = isAxiosError
        ? error.message
        : "Ocorreu um erro ao realizar login, tente novamente mais tarde!";

      showToast({
        title,
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Screen safeEdges={["bottom"]} w={"full"} px={0} bg={"gray.700"}>
      <KeyboardAwareScrollView>
        <VStack
          flex={1}
          alignItems={"center"}
          w={"full"}
          bg={"gray.600"}
          roundedBottom={24}
          bottom={-6}
          zIndex={1}
          px={12}
          pt={height > 700 ? 32 : 20}
        >
          <Image
            alt="Logo da aplicação"
            defaultSource={Logo}
            source={Logo}
            resizeMode="contain"
            w={24}
            h={16}
            mb={5}
          />
          <Image
            alt="Logo escrita da aplicação"
            defaultSource={MarketSpace}
            source={MarketSpace}
            resizeMode="contain"
            w={48}
            h={7}
          />
          <Text fontSize={"sm"} color={"gray.300"}>
            Seu espaço de compra e venda
          </Text>

          <VStack
            w={"full"}
            alignItems={"center"}
            space={4}
            mb={8}
            mt={height > 700 ? 20 : 10}
          >
            <Text fontSize={"sm"}>Acesse sua conta</Text>
            <Controller
              control={control}
              name="email"
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  placeholder="Email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  isReadOnly={isLogging}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  ref={passwordRef}
                  placeholder="Senha"
                  secureTextEntry={!isVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  isReadOnly={isLogging}
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
                />
              )}
            />
          </VStack>
          <Button
            text="Entrar"
            variant="blue"
            mb={height > 700 ? 20 : 10}
            isLoading={isLogging}
            onPress={handleSubmit(onSubmit)}
          />
        </VStack>
        <VStack
          justifyContent={"center"}
          w={"full"}
          space={4}
          alignItems={"center"}
          px={12}
          py={height > 700 ? "12" : "6"}
        >
          <Text>Ainda não tem acesso?</Text>

          <Button
            text="Criar uma conta"
            variant="gray"
            onPress={handleNavigateToSignUpScreen}
            isDisabled={isLogging}
          />
        </VStack>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

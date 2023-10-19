import { Input, Screen, Icon, Button } from "@components";
import { Box, Image, ScrollView, Text, VStack, useTheme } from "native-base";
import Logo from "../assets/imagens/logo.png";
import MarketSpace from "../assets/imagens/marketspace.png";
import { useState } from "react";
import { useSafeAreaEdges } from "@hooks";

export const SignInScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { colors } = useTheme();

  const { paddingBottom } = useSafeAreaEdges(["bottom"]);
  return (
    <Screen safeEdges={[]} px={0}>
      <ScrollView
        flex={1}
        contentContainerStyle={{
          paddingTop: 65,
          paddingBottom: paddingBottom,
          flex: 1,
        }}
      >
        <Box
          flex={1}
          alignItems={"center"}
          justifyContent={"flex-end"}
          w={"full"}
          bg={"gray.600"}
          px={12}
          roundedBottom={24}
          bottom={-6}
          zIndex={1}
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

          <VStack w={"full"} alignItems={"center"} space={4} mb={8} mt={20}>
            <Text fontSize={"sm"}>Acesse sua conta</Text>

            <Input
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <Input
              placeholder="Senha"
              secureTextEntry={!isVisible}
              autoCapitalize="none"
              autoCorrect={false}
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
          </VStack>
          <Button text="Entrar" variant="blue" mb={20} />
        </Box>

        <VStack
          w={"full"}
          space={4}
          alignItems={"center"}
          bg={"gray.700"}
          px={12}
          py={12}
        >
          <Text>Ainda não tem acesso?</Text>

          <Button text="Entrar" variant="gray" />
        </VStack>
      </ScrollView>
    </Screen>
  );
};

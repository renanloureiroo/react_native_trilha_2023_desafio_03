import { Avatar, Button, Icon, Input, Radio, Screen } from "@components";

import { useState } from "react";
import {
  Box,
  Divider,
  HStack,
  Heading,
  Radio as NBRadio,
  Text,
  useTheme,
} from "native-base";
import { useAuth } from "@hooks";

export const HomeScreen = () => {
  const [value, setValue] = useState("");
  const { colors } = useTheme();

  const { signOut, user } = useAuth();
  const name = user.name.split(" ")[0];
  return (
    <Screen safeEdges={["top"]}>
      <HStack alignItems={"center"} space={"2"} mt={"5"} mb={"8"}>
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
        />
      </HStack>

      <Text color={"gray.300"} fontSize={"sm"} mb={3}>
        Seus produtos anunciados para venda
      </Text>

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
          <Heading fontSize={"lg"} fontFamily={"heading"} color={"gray.200"}>
            4
          </Heading>
          <Text>anúncios ativos</Text>
        </Box>
        <HStack space={"2"}>
          <Heading fontSize={"xs"} color={"blue.500"}>
            Meus anúncios
          </Heading>
          <Icon name="ArroRightRegular" color={colors.blue[500]} size={16} />
        </HStack>
      </HStack>

      <Text color={"gray.300"} fontSize={"sm"} mb={3}>
        Compre produtos variados
      </Text>
      <Input
        placeholder="Buscar anúncio"
        rightElement={
          <HStack mr={4}>
            <Icon
              name="MagnifyingGlassRegular"
              color={colors.gray[200]}
              size={20}
              onPress={() => console.log("search")}
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
              onPress={() => console.log("Filtro")}
            />
          </HStack>
        }
      />
    </Screen>
  );
};

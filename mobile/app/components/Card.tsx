import { formatter } from "@utils";
import {
  Box,
  HStack,
  Heading,
  IPressableProps,
  Image,
  Pressable,
  Text,
  useTheme,
} from "native-base";
import { FC } from "react";
import { useWindowDimensions } from "react-native";
import { Avatar } from "./Avatar";

interface CardProps extends Omit<IPressableProps, "children"> {
  data: {
    index: number;
    name: string;
    price: number;
    is_new: boolean;
    thumbnail?: string;
    avatar?: string;
  };
  showAvatar?: boolean;
}

export const Card: FC<CardProps> = (props) => {
  const {
    data: { price, thumbnail, name, index, is_new, avatar },
    showAvatar = false,
    ...rest
  } = props;
  const { colors } = useTheme();

  const { width } = useWindowDimensions();
  const widthFinal = (width - 48 - 20) / 2;
  const heightFinal = (widthFinal / 3) * 2;
  return (
    <Pressable
      mr={index % 2 === 0 ? 5 : 0}
      android_ripple={{
        color: colors.blue[700],
        foreground: true,
      }}
      _pressed={{
        opacity: 0.7,
      }}
      rounded={"6px"}
      {...rest}
    >
      <Box position={"relative"}>
        <Image
          source={{
            uri: thumbnail,
          }}
          alt="Alternate Text"
          w={`${widthFinal}px`}
          height={`${heightFinal}px`}
          rounded={"sm"}
          resizeMode="cover"
        />
        {showAvatar && (
          <Box position={"absolute"} left={1} top={1}>
            <Avatar
              photo={avatar}
              size={"sm"}
              borderColor={"gray.700"}
              borderWidth={1}
            />
          </Box>
        )}
        <Box
          bgColor={is_new ? "blue.500" : "gray.200"}
          px={2}
          py={"2px"}
          rounded={"full"}
          position={"absolute"}
          right={1}
          top={1}
        >
          <Heading fontFamily={"heading"} color={"gray.700"} fontSize={"xs"}>
            {is_new ? "Novo" : "Usado"}
          </Heading>
        </Box>
      </Box>

      <Text fontSize={"sm"} flex={1} numberOfLines={1}>
        {name}
      </Text>

      <HStack alignItems={"flex-end"} space={"1"}>
        <Text fontSize={"xs"} fontFamily={"heading"}>
          R$
        </Text>
        <Heading fontSize={"md"} fontFamily={"bold"}>
          {formatter.currency(String(price / 100), "format", false)}
        </Heading>
      </HStack>
    </Pressable>
  );
};

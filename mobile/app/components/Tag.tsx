import { HStack, Heading, Pressable, useTheme } from "native-base";
import { FC } from "react";
import { Icon } from "./Icon";

interface TagProps {
  selected?: boolean;
  text: string;
  onPress?: () => void;
}

export const Tag: FC<TagProps> = (props) => {
  const { selected = false, text, onPress } = props;
  const { colors } = useTheme();
  return (
    <Pressable
      py={"6px"}
      px={"4"}
      rounded={"full"}
      bg={selected ? "blue.700" : "gray.500"}
      onPress={onPress}
      _android={{
        android_ripple: {
          color: selected ? colors.gray[500] : colors.blue[700],
        },
      }}
      _ios={{
        _pressed: {
          opacity: 0.7,
        },
      }}
      _pressed={{
        bg: selected ? "blue.700" : "gray.500",
      }}
    >
      <HStack alignItems={"center"} space={1}>
        <Heading
          fontFamily={"bold"}
          fontSize={"xs"}
          color={selected ? "gray.700" : "gray.300"}
        >
          {text}
        </Heading>

        {selected && (
          <Icon size={12} color={colors.gray[700]} name="XCircleFill" />
        )}
      </HStack>
    </Pressable>
  );
};

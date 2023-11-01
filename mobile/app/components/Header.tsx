import { FC } from "react";
import { Icon, IconName } from "./Icon";
import { Box, HStack, Heading, useTheme } from "native-base";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps extends React.ComponentProps<typeof HStack> {
  iconLeft?: IconName;
  onPressIconLeft?: () => void;
  iconRight?: IconName;
  onPressIconRight?: () => void;
  title?: string;
}

export const Header: FC<HeaderProps> = (props) => {
  const {
    title,
    iconLeft,
    iconRight,
    onPressIconLeft,
    onPressIconRight,
    ...rest
  } = props;
  const { colors } = useTheme();

  const renderItem = (
    conditionalItem?: IconName,
    side: "left" | "right" = "left"
  ) => {
    return conditionalItem ? (
      <Icon
        name={(side === "left" ? iconLeft : iconRight) as IconName}
        size={24}
        color={colors.gray[100]}
        onPress={side === "left" ? onPressIconLeft : onPressIconRight}
      />
    ) : (
      <Box w={"6"} />
    );
  };

  return (
    <HStack paddingTop={"2"} {...rest} pb={"3"}>
      {renderItem(iconLeft)}

      {title ? (
        <Heading
          fontFamily={"heading"}
          fontSize={"lg"}
          flex={1}
          textAlign={"center"}
        >
          {title}
        </Heading>
      ) : (
        <Box flex={1} />
      )}

      {renderItem(iconRight, "right")}
    </HStack>
  );
};

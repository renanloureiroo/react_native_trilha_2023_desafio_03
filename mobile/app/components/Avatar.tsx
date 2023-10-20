import { FC } from "react";
import {
  Avatar as NBAvatar,
  useTheme,
  Pressable,
  IPressableProps,
  IAvatarProps,
} from "native-base";
import { Icon } from "./Icon";
import AvatarDefault from "../assets/imagens/avatar.png";

interface AvatarProps extends IPressableProps {
  photo?: string;
  isPicker?: boolean;
  size?: IAvatarProps["size"];
}

export const Avatar: FC<AvatarProps> = (props) => {
  const {
    photo,
    isPicker = false,
    onPress,
    size = "xl",

    ...rest
  } = props;
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={isPicker ? onPress : undefined}
      _android={{
        _pressed: {
          android_ripple: {
            color: colors.gray[100],
          },
        },
      }}
      _ios={{
        _pressed: {
          opacity: isPicker ? 0.7 : 1,
        },
      }}
      {...rest}
    >
      <NBAvatar
        size={size}
        borderWidth={3}
        borderColor={"blue.700"}
        bgColor={"gray.500"}
        source={photo ? { uri: photo } : AvatarDefault}
      >
        {isPicker && (
          <NBAvatar.Badge
            bg={"blue.700"}
            alignItems={"center"}
            justifyContent={"center"}
            size={10}
            borderWidth={0}
            bottom={-5}
            right={-5}
          >
            <Icon
              name="PencilSimpleLineRegular"
              color={colors.gray[700]}
              size={16}
            />
          </NBAvatar.Badge>
        )}
      </NBAvatar>
    </Pressable>
  );
};

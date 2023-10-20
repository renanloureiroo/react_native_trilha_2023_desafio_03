import { Button as NBButton, useTheme } from "native-base";
import { FC } from "react";
import { Icon } from "./Icon";

interface ButtonProps extends React.ComponentProps<typeof NBButton> {
  text: string;
  variant?: "black" | "blue" | "gray";
}

export const Button: FC<ButtonProps> = (props) => {
  const { text, variant = "black", ...rest } = props;

  const { colors } = useTheme();
  const bgColor =
    variant === "blue"
      ? colors.blue[700]
      : variant === "gray"
      ? colors.gray[500]
      : colors.gray[100];
  return (
    <NBButton
      p={3}
      flex={1}
      w={"full"}
      rounded={6}
      bg={bgColor}
      _text={{
        fontWeight: "bold",
        fontSize: "sm",
        fontFamily: "heading",
        color: variant === "gray" ? colors.gray[100] : colors.gray[600],
      }}
      _android={{
        android_ripple: {
          color: variant === "gray" ? colors.gray[100] : colors.gray[600],
        },
      }}
      _ios={{
        _pressed: {
          opacity: 0.7,
        },
      }}
      _pressed={{
        bg: bgColor,
      }}
      {...rest}
    >
      {text}
    </NBButton>
  );
};

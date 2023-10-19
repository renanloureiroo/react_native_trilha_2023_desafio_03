import { Button as NBButton, useTheme } from "native-base";
import { FC } from "react";
import { Icon } from "./Icon";

interface ButtonProps extends React.ComponentProps<typeof NBButton> {
  text: string;
  variant?: "black" | "blue" | "gray";
}

export const Button: FC<ButtonProps> = (props) => {
  const { text, variant = "black", ...rest } = props;

  const bgColor =
    variant === "blue"
      ? "blue.700"
      : variant === "gray"
      ? "gray.500"
      : "gray.100";
  return (
    <NBButton
      p={3}
      w={"full"}
      rounded={6}
      bg={bgColor}
      _text={{
        fontWeight: "bold",
        fontSize: "sm",
        fontFamily: "heading",
        color: variant === "gray" ? "gray.100" : "gray.700",
      }}
      {...rest}
    >
      {text}
    </NBButton>
  );
};

import { Radio as NBRadio } from "native-base";
import { FC, ReactNode } from "react";
type NBRadioProps = React.ComponentProps<typeof NBRadio>;

interface RadioProps extends Omit<NBRadioProps, "children"> {
  children: ReactNode;
}

export const Radio: FC<RadioProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <NBRadio
      _checked={{
        borderColor: "blue.700",
        _icon: {
          color: "blue.700",
        },
      }}
      {...rest}
    >
      {children}
    </NBRadio>
  );
};

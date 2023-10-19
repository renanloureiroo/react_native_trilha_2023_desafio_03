import { FC, ReactNode } from "react";
import { Checkbox as NBCheckBox } from "native-base";

type NBCheckBoxProps = React.ComponentProps<typeof NBCheckBox>;

interface CheckBoxProps extends Omit<NBCheckBoxProps, "children"> {
  children: ReactNode;
}

export const CheckBox: FC<CheckBoxProps> = (props) => {
  const { children, color = "blue.200", ...rest } = props;
  return (
    <NBCheckBox
      _checked={{
        bg: "blue.700",
        borderColor: "blue.700",
      }}
      {...rest}
    >
      {children}
    </NBCheckBox>
  );
};

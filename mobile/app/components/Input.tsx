import { FC } from "react";
import { FormControl, Input as NBInput } from "native-base";

interface InputProps extends React.ComponentProps<typeof NBInput> {}

export const Input: FC<InputProps> = (props) => {
  const { ...rest } = props;
  return (
    <FormControl>
      <NBInput
        px={"4"}
        py={"3"}
        fontSize={"lg"}
        placeholderTextColor={"gray.400"}
        color={"gray.200"}
        bg="gray.700"
        borderColor={"transparent"}
        _focus={{
          bg: "gray.700s",
          borderColor: "gray.100",
        }}
        {...rest}
      />
    </FormControl>
  );
};

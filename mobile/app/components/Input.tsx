import { FC, ForwardRefRenderFunction, forwardRef } from "react";
import { FormControl, Input as NBInput } from "native-base";
import { TextInput } from "react-native";

interface InputProps extends React.ComponentProps<typeof NBInput> {
  errorMessage?: string;
}

const Base: ForwardRefRenderFunction<TextInput, InputProps> = (props, ref) => {
  const { isInvalid, errorMessage, ...rest } = props;

  return (
    <FormControl isInvalid={isInvalid}>
      <NBInput
        ref={ref as React.RefObject<TextInput>}
        px={"4"}
        py={"3"}
        fontSize={"md"}
        placeholderTextColor={"gray.400"}
        color={"gray.200"}
        bg="gray.700"
        borderColor={"transparent"}
        _focus={{
          bg: "gray.700s",
          borderColor: "gray.100",
        }}
        _invalid={{
          _focus: {
            borderColor: "red.400",
          },
        }}
        {...rest}
        isInvalid={isInvalid}
      />

      {errorMessage && (
        <FormControl.ErrorMessage
          mt={1}
          _text={{
            color: "red.400",
          }}
        >
          {errorMessage}
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};

export const Input = forwardRef(Base);

Input.displayName = "Input";

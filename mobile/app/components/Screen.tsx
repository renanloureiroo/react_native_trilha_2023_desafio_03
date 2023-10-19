import { FC, ReactNode } from "react";

import { useSafeAreaEdges } from "@hooks";
import { VStack } from "native-base";

type SafeEdges = "top" | "bottom" | "right" | "left";

interface ScreenProps extends React.ComponentProps<typeof VStack> {
  children: ReactNode;
  safeEdges?: Array<SafeEdges>;
}

export const Screen: FC<ScreenProps> = (props) => {
  const {
    children,
    safeEdges = ["bottom", "top"],
    bg = "gray.600",
    px = "6",
    ...rest
  } = props;

  const insets = useSafeAreaEdges(safeEdges);

  return (
    <VStack flex={1} bg={bg} px={px} style={insets} {...rest}>
      {children}
    </VStack>
  );
};

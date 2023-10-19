import { FlexStyle } from "react-native";
import { Edge, useSafeAreaInsets } from "react-native-safe-area-context";

const propertySuffixMap = {
  top: "Top",
  bottom: "Bottom",
  left: "Start",
  right: "End",
  start: "Start",
  end: "End",
};

export const useSafeAreaEdges = (
  safeAreaEdges: Edge[] = []
): Pick<
  FlexStyle,
  "paddingBottom" | "paddingTop" | "paddingRight" | "paddingLeft"
> => {
  const insets = useSafeAreaInsets();

  return safeAreaEdges.reduce((acc, e) => {
    return {
      ...acc,
      [`padding${propertySuffixMap[e]}`]: insets[e],
    };
  }, {});
};

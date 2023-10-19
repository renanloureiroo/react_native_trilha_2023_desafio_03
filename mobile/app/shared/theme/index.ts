import { extendTheme } from "native-base";

export const theme = extendTheme({
  colors: {
    blue: {
      500: "#364D9D",
      700: "#647AC7",
    },
    gray: {
      700: "#F7F7F8",
      600: "#EDECEE",
      500: "#D9D8DA",
      400: "#9F9BA1",
      300: "#5F5B62",
      200: "#3E3A40",
      100: "#1A181B",
    },
    white: "#FFFFFF",
    red: {
      400: "#EE7979",
    },
  },
  fonts: {
    heading: "Karla_700Bold",
    body: "Karla_400Regular",
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },

  components: {
    Text: {
      defaultProps: {
        color: "gray.200",
      },
    },
    Heading: {
      defaultProps: {
        color: "gray.100",
      },
    },
  },
});

import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";

import { SafeAreaProvider } from "react-native-safe-area-context";
// import { HomeScreen } from "./app/screens";
import { useFontsLoaded } from "./app/hooks";

import * as SplashScreen from "expo-splash-screen";
import { Box, NativeBaseProvider } from "native-base";
import { HomeScreen, SignInScreen } from "@screens";
import { theme } from "./app/shared/theme";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { loaded } = useFontsLoaded();

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        <Box flex={1} onLayout={onLayoutRootView}>
          <StatusBar translucent backgroundColor="transparent" />
          <SignInScreen />
        </Box>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

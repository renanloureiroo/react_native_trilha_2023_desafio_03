import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFontsLoaded } from "./app/hooks";

import * as SplashScreen from "expo-splash-screen";
import { Box, NativeBaseProvider } from "native-base";

import { theme } from "./app/shared/theme";
import { LogBox } from "react-native";
import { setupReactotron } from "./app/shared/services/reactotron";
import { AppNavigator } from "@navigation";
import { AuthContextProvider } from "@contexts";

SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs([
  "In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.",
]);

setupReactotron({
  // clear the Reactotron window when the app loads/reloads
  clearOnLoad: true,
  // generally going to be localhost
  host: "localhost",
  // Reactotron can monitor AsyncStorage for you
  useAsyncStorage: true,
  // log the initial restored state from AsyncStorage
  logInitialState: true,
  // log out any snapshots as they happen (this is useful for debugging but slow)
  logSnapshots: false,
});
export default function App() {
  const { loaded } = useFontsLoaded();

  const onLayoutRootView = useCallback(
    async (heydrated: boolean) => {
      if (loaded && !heydrated) {
        await SplashScreen.hideAsync();
      }
    },
    [loaded]
  );

  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        <StatusBar translucent backgroundColor="transparent" />
        <AuthContextProvider>
          <AppNavigator onLayoutRootView={onLayoutRootView} />
        </AuthContextProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

import { FC } from "react";
import { Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStackNagivator } from "./AuthNavigator";
import { useAuth } from "@hooks";

import { AppBottomTabNavigator } from "./AppBottomTabNavigator";

interface MainNavigatorProps {
  onLayoutRootView: (heydrated: boolean) => Promise<void>;
}

export const MainNavigator: FC<MainNavigatorProps> = (props) => {
  const { onLayoutRootView } = props;

  const { user, heydrated } = useAuth();

  if (heydrated) {
    return null;
  }
  return (
    <Box flex={1} onLayout={() => onLayoutRootView(heydrated)}>
      <NavigationContainer>
        {user?.id ? <AppBottomTabNavigator /> : <AuthStackNagivator />}
      </NavigationContainer>
    </Box>
  );
};

import { NavigationContainer } from "@react-navigation/native";
import { AuthStackNagivator } from "./AuthNavigator";
import { useAuth } from "@hooks";
import { HomeScreen } from "@screens";
import { FC } from "react";
import { Box } from "native-base";

interface AppNavigatorProps {
  onLayoutRootView: (heydrated: boolean) => Promise<void>;
}

export const AppNavigator: FC<AppNavigatorProps> = (props) => {
  const { onLayoutRootView } = props;

  const { user, heydrated } = useAuth();

  if (heydrated) {
    return null;
  }
  return (
    <Box flex={1} onLayout={() => onLayoutRootView(heydrated)}>
      <NavigationContainer>
        {user?.id ? <HomeScreen /> : <AuthStackNagivator />}
      </NavigationContainer>
    </Box>
  );
};

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen, MyAdsScreen } from "@screens";
import { configNavigatorDefault } from "@config";
import { Icon, IconName, TabBarCustom } from "@components";
import { useTheme } from "native-base";

import {
  NavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";
import {
  CreateAndEditAdNagivator,
  CreateAndEditAdNavigatorParamList,
} from "./CreateAndEditAdNavigator";
import { ProductContextProvider } from "../contexts";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { useAuth } from "@hooks";

export type AppBottomTabParamList = {
  Home: undefined;
  Profile: undefined;
  CreateAndEditAd: NavigatorScreenParams<CreateAndEditAdNavigatorParamList>;
};

const { Screen, Navigator, Group } =
  createBottomTabNavigator<AppBottomTabParamList>();

const icons: Record<
  string,
  {
    regular: IconName;
    bold: IconName;
  }
> = {
  Home: {
    regular: "HouseRegular",
    bold: "HouseBold",
  },

  Profile: {
    regular: "TagRegular",
    bold: "TagBold",
  },
};

export type AppNavigationProps<T extends keyof AppBottomTabParamList> =
  NavigationProp<AppBottomTabParamList, T>;

export type AppRouteProps<T extends keyof AppBottomTabParamList> = RouteProp<
  AppBottomTabParamList,
  T
>;

export const AppBottomTabNavigator = () => {
  const { colors } = useTheme();

  const { bottomSheetRef } = useAuth();

  return (
    <ProductContextProvider>
      <Navigator
        screenOptions={{
          ...configNavigatorDefault,
        }}
        tabBar={(props) => (
          <TabBarCustom
            bottomSheetRef={bottomSheetRef}
            initialActiveRoute="Home"
            icons={icons}
            {...props}
          />
        )}
      >
        <Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon(props) {
              return (
                <Icon
                  name={props.focused ? "HouseBold" : "HouseRegular"}
                  size={props.size}
                  color={props.color}
                />
              );
            },
          }}
        />
        <Screen
          name="Profile"
          component={MyAdsScreen}
          options={{
            tabBarIcon(props) {
              return (
                <Icon
                  name={props.focused ? "TagBold" : "TagRegular"}
                  size={props.size}
                  color={props.color}
                />
              );
            },
          }}
        />
        <Screen
          name="CreateAndEditAd"
          component={CreateAndEditAdNagivator}
          options={{
            tabBarButton: (props) => null,
            unmountOnBlur: true,
          }}
        />
      </Navigator>
    </ProductContextProvider>
  );
};

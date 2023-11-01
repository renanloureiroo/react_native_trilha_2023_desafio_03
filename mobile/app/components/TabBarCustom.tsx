import { useCallback, useEffect, useState } from "react";
import { Icon, IconName } from "./Icon";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ViewStyle } from "react-native";
import { useAuth, useSafeAreaEdges } from "@hooks";
import { HStack, useTheme } from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface TabBarCustomProps extends BottomTabBarProps {
  initialActiveRoute: string;
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  icons: Record<
    string,
    {
      regular: IconName;
      bold: IconName;
    }
  >;
}

export const TabBarCustom = (props: TabBarCustomProps) => {
  const { icons, initialActiveRoute, bottomSheetRef, ...rest } = props;

  const { signOut } = useAuth();

  const { paddingBottom } = useSafeAreaEdges(["bottom"]);
  const { colors } = useTheme();
  const [activeRoute, setActiveRoute] = useState(initialActiveRoute);

  const handleOnPress = useCallback((route: string) => {
    setActiveRoute(route);
    props.navigation.navigate(route);
  }, []);

  const routes = rest.state.routes
    .map((route) => route.name)
    .filter((route) => !!icons[route])
    .map((route) => {
      return {
        name: route,
        active: route === activeRoute,
        icon: icons[route],
      };
    });

  const $tabBarStyle = {
    paddingBottom,
  } as ViewStyle;

  useEffect(() => {
    setActiveRoute(rest.state.routes[rest.state.index].name);
  }, [rest.state]);

  useEffect(() => {
    if (activeRoute === "CreateAndEditAd") {
      props.bottomSheetRef.current?.present();
    } else {
      props.bottomSheetRef.current?.dismiss();
    }
  }, [activeRoute]);

  if (activeRoute === "CreateAndEditAd" || activeRoute === "ShowAd") {
    return null;
  }

  return (
    <HStack
      style={!(Number(paddingBottom) === 0) ? $tabBarStyle : null}
      bgColor={"gray.700"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      width={"full"}
      paddingTop={"5"}
      paddingBottom={Number(paddingBottom) === 0 ? "5" : undefined}
    >
      {routes.map(({ active, icon, name }) => {
        return (
          <Icon
            key={name}
            name={active ? icon.bold : icon.regular}
            color={active ? colors.gray[200] : colors.gray[400]}
            size={24}
            onPress={() => handleOnPress(name)}
            pressEffect
          />
        );
      })}

      <Icon
        name="SignOutRegular"
        color={colors.red[400]}
        size={24}
        onPress={signOut}
      />
    </HStack>
  );
};

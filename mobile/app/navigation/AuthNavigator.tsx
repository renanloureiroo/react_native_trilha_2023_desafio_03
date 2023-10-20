import { NavigationProp, RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignInScreen, SignUpScreen } from "@screens";

export type AuthStackNavigatorParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type AuthStackNavigationProps<
  T extends keyof AuthStackNavigatorParamList
> = NavigationProp<AuthStackNavigatorParamList, T>;

export type AuthStackRouteProps<T extends keyof AuthStackNavigatorParamList> =
  RouteProp<AuthStackNavigatorParamList, T>;

const { Navigator, Screen } =
  createNativeStackNavigator<AuthStackNavigatorParamList>();

export const AuthStackNagivator = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "transparent",
        },
      }}
      initialRouteName="SignIn"
    >
      <Screen name="SignIn" component={SignInScreen} />
      <Screen name="SignUp" component={SignUpScreen} />
    </Navigator>
  );
};

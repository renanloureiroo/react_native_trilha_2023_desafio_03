import { configNavigatorDefault } from "@config";
import { CreateAndEditContextProvider } from "@contexts";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateAdScreen, PreviewAdScreen, ShowAdScreen } from "@screens";

export type CreateAndEditAdNavigatorParamList = {
  ShowAd: {
    id: string;
    myAd?: boolean;
  };
  CreateAndEdit: {
    id?: string;
  };
  Preview: {
    create?: boolean;
  };
};

export type CreateAndEditAdNavigationProps<
  T extends keyof CreateAndEditAdNavigatorParamList
> = NavigationProp<CreateAndEditAdNavigatorParamList, T>;

export type CreateAndEditAdRouteProps<
  T extends keyof CreateAndEditAdNavigatorParamList
> = RouteProp<CreateAndEditAdNavigatorParamList, T>;

const { Navigator, Screen } =
  createNativeStackNavigator<CreateAndEditAdNavigatorParamList>();

export const CreateAndEditAdNagivator = () => {
  return (
    <CreateAndEditContextProvider>
      <Navigator
        screenOptions={{
          ...configNavigatorDefault,
        }}
      >
        <Screen name="ShowAd" component={ShowAdScreen} />
        <Screen name="CreateAndEdit" component={CreateAdScreen} />
        <Screen name="Preview" component={PreviewAdScreen} />
      </Navigator>
    </CreateAndEditContextProvider>
  );
};

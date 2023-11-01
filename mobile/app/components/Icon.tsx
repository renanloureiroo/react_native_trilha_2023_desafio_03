import {
  Icon as NBIcon,
  IIconProps,
  useTheme,
  Pressable,
  IPressableProps,
} from "native-base";
import { FC } from "react";

import ArroLeftRegular from "../assets/icons/arrow-left-regular.svg";
import ArroRightRegular from "../assets/icons/arrow-right-regular.svg";
import BankRegular from "../assets/icons/bank-regular.svg";
import BarCodeRegular from "../assets/icons/barcode-regular.svg";
import CaretDownRegular from "../assets/icons/caret-down-regular.svg";
import CaretLeftRegular from "../assets/icons/caret-left-regular.svg";
import CaretRightRegular from "../assets/icons/caret-right-regular.svg";
import CaretUpRegular from "../assets/icons/caret-up-regular.svg";
import CreditCardRegular from "../assets/icons/credit-card-regular.svg";
import EyeRegular from "../assets/icons/eye-regular.svg";
import EyeSlashRegular from "../assets/icons/eye-slash-regular.svg";
import HouseBold from "../assets/icons/house-bold.svg";
import HouseRegular from "../assets/icons/house-regular.svg";
import MagnifyingGlassRegular from "../assets/icons/magnifying-glass-regular.svg";
import MoneyRegular from "../assets/icons/money-regular.svg";
import PencilSimpleLineRegular from "../assets/icons/pencil-simple-line-regular.svg";
import PlusRegular from "../assets/icons/plus-regular.svg";
import PowerRegular from "../assets/icons/power-regular.svg";
import QrCodeRegular from "../assets/icons/qr-code-regular.svg";
import SignOutRegular from "../assets/icons/sign-out-regular.svg";
import SlidersRegular from "../assets/icons/sliders-regular.svg";
import TagBold from "../assets/icons/tag-bold.svg";
import TagRegular from "../assets/icons/tag-regular.svg";
import TrashSimpleRegular from "../assets/icons/trash-simple-regular.svg";
import WhatsAppLogoFill from "../assets/icons/whatsapp-logo-fill.svg";
import XCircleFill from "../assets/icons/x-circle-fill.svg";
import XRegular from "../assets/icons/x-regular.svg";
import { SvgProps } from "react-native-svg";

const icons = {
  ArroLeftRegular,
  ArroRightRegular,
  BankRegular,
  BarCodeRegular,
  CaretDownRegular,
  CaretLeftRegular,
  CaretRightRegular,
  CreditCardRegular,
  CaretUpRegular,
  EyeRegular,
  EyeSlashRegular,
  HouseBold,
  HouseRegular,
  MagnifyingGlassRegular,
  MoneyRegular,
  PencilSimpleLineRegular,
  PlusRegular,
  PowerRegular,
  QrCodeRegular,
  SignOutRegular,
  SlidersRegular,
  TagBold,
  TagRegular,
  TrashSimpleRegular,
  WhatsAppLogoFill,
  XCircleFill,
  XRegular,
};

export type IconName = keyof typeof icons;

interface IconProps extends SvgProps, Pick<IPressableProps, "mx"> {
  name: IconName;
  size: number;
  pressEffect?: boolean;
}

export const Icon: FC<IconProps> = (props) => {
  const {
    name,
    onPress,
    size,
    color = "#000000",
    pressEffect = true,
    ...rest
  } = props;

  const { colors } = useTheme();

  const IconComponent = icons[name];

  if (onPress && !pressEffect) {
    return (
      <Pressable
        onPress={onPress}
        alignItems={"center"}
        justifyContent={"center"}
        {...rest}
      >
        {({ isPressed }) => (
          <IconComponent color={color} width={size} height={size} />
        )}
      </Pressable>
    );
  }

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{
          color: colors.gray[400],
          borderless: true,
        }}
        _pressed={{
          opacity: 0.7,
        }}
        alignItems={"center"}
        justifyContent={"center"}
        {...rest}
      >
        {({ isPressed }) => (
          <IconComponent color={color} width={size} height={size} {...rest} />
        )}
      </Pressable>
    );
  }

  return <IconComponent color={color} width={size} height={size} {...rest} />;
};

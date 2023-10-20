import { useToast } from "native-base";

interface ToastProps {
  colorScheme?: "success" | "warning" | "danger" | "info";
  title: string;
  description?: string;
  placement?: "top" | "bottom";
}

const colors = {
  success: "green.500",
  warning: "yellow.500",
  danger: "red.400",
  info: "blue.400",
};

export const useCustomToasts = () => {
  const { show } = useToast();

  const showToast = ({
    colorScheme = "danger",
    title,
    placement = "top",
    description,
  }: ToastProps) => {
    show({
      title,
      bgColor: colors[colorScheme],
      placement,
      description: description,
      duration: 3000,
    });
  };

  return { showToast };
};

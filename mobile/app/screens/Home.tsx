import { Button, Input, Radio, Screen } from "@components";

import { useState } from "react";
import { Radio as NBRadio } from "native-base";

export const HomeScreen = () => {
  const [value, setValue] = useState("");
  return (
    <Screen>
      <Input />

      <Button text="Button" />
      <Button text="Button" variant="blue" />
      <Button text="Button" variant="gray" />
      <NBRadio.Group name="options">
        <Radio value="1">Teste</Radio>
        <Radio value="2">Teste2</Radio>
        <Radio value="3">Teste3</Radio>
      </NBRadio.Group>
    </Screen>
  );
};

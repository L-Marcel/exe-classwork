import { HStack, Switch as ChakraSwitch, SwitchProps as ChakraSwitchProps, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { UseFormRegisterReturn, UseFormWatch } from "react-hook-form";

interface SwitchProps extends ChakraSwitchProps {
  register?: UseFormRegisterReturn;
  text?: string;
  watch?: UseFormWatch<any>;
};

function Switch({ text, register, watch, onChange, ...rest }: SwitchProps) {
  const watchedValue = (watch && register)? watch(register?.name):false;
  const [isChecked, setIsChecked] = useState(watchedValue);

  useEffect(() => {
    setIsChecked(watchedValue);
  }, [watchedValue]);

  const handleChangeIsChecked = useCallback((e: any) => {
    const { checked: value, name }: { 
      checked: boolean, 
      name: string 
    } = e.target;

    let ev: any = { target: { 
      value: value,
      name: name
    }};

    setIsChecked(value);
    onChange && onChange(ev);
    register?.onChange(ev);
  }, [setIsChecked, onChange, register]);

  return (
    <HStack>
      <ChakraSwitch
        tabIndex={0}
        id="switch"
        className="focus-visible"
        {...register}
        {...rest}
        isChecked={isChecked}
        onChange={handleChangeIsChecked}
        onKeyDown={(e) => {
          if(e.key === "Enter") {
            const target: any = e.target;

            handleChangeIsChecked({
              target: {
                checked: !target?.checked as any,
                name: target?.name
              }
            });
          };
        }}
        _focusWithin={{
          outline: "2px solid var(--chakra-colors-primary-600)",
          outlineOffset: 3,
          borderRadius: 8
        }}
      />
      { text && <Text pl={2}>
        {text} {(watch && register) && (watch(register?.name)? "Yes.":"No.")}
      </Text>}
    </HStack>
  );
};

export { Switch };


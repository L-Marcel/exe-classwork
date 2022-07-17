import { Box, BoxProps, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { ReactNode, useCallback } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import ReactSelect, { StylesConfig } from "react-select";
import { useInputErrors } from "../../contexts/hooks/useInputErrors";
import { IconButton } from "../Buttons/IconButton";
import { NamedIcon } from "../NamedIcon";
import { TooltipOnHover } from "../TooltipOnHover";

interface SelectProps extends BoxProps {
  options: SelectOption[];
  register?: UseFormRegisterReturn;
  selectStyles?: StylesConfig;
  labelFormat?: (data) => ReactNode;
  error?: string;
  value?: any;
  controlledValue?: any;
  onChange?: (value: any) => void;
  isLoading?: boolean;
  isMulti?: boolean;
  name?: string;
};

function Select({ 
  options, 
  onChange, 
  children,
  maxW = ["90%", "80%", "50%", "30%", "35%", "40%"],
  isLoading,
  placeholder,
  borderRadius = 0,
  register,
  selectStyles,
  labelFormat,
  controlledValue,
  isMulti,
  name,
  value,
  ...rest 
}: SelectProps) {
  const { inputErrors } = useInputErrors();
  const error = inputErrors[name ?? register?.name];

  const handleChangeValue = useCallback((newValue: SelectOption) => {
    let ev;
  
    if(Array.isArray(newValue)) {
      ev = { target: { 
        value: newValue.map(v => v.value),
        name: register?.name
      }};
    } else {
      ev = { target: { 
        value: newValue.value,
        name: register?.name
      }};
    };

    register?.onChange(ev);
    onChange && onChange(ev.target.value);
  }, [onChange, register]);

  return (
    <>
      <Box
        as={m.div}
        zIndex={90}
        w={[300, 350, 500]}
        maxW="80vw"
        {...rest}
        className={undefined}
        _hover={{
          zIndex: 100
        }}
        _focus={{
          zIndex: 100
        }}
        _focusWithin={{
          zIndex: 100
        }}
      >
        <Box
          as={m.div}
          w="100%"
          animate="visible"
          _focusWithin={{
            outline: "2px solid var(--chakra-colors-primary-600)",
            outlineOffset: 3,
            borderRadius: 8
          }}
        >
          <ReactSelect
            id="select"
            tabIndex={0}
            placeholder={placeholder}
            className={"focus-visible " + rest.className}      
            styles={selectStyles}
            isMulti={isMulti}
            options={options}
            {...register}
            defaultValue={controlledValue ?? value}
            value={controlledValue}
            formatOptionLabel={labelFormat}
            loadingMessage={() => {
              return (<Text>Searching...</Text>);
            }}
            isLoading={isLoading}
            noOptionsMessage={() => {
              return (<Text>No data found...</Text>);
            }}
            onChange={handleChangeValue}
            components={{
              MultiValue: ({ children, ...rest }) => {
                return (
                  <Box
                    bgColor="var(--chakra-colors-solid-75)"
                    position="relative"
                    py={1}
                    pl={8}
                    pr={30}
                    mt={2}
                    mr={4}
                    maxW="100%"
                    borderRadius={8}
                    display="flex"
                    alignItems="center"
                    {...rest}
                  >
                    <Text
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      maxW="100%"
                    >
                      {children}
                    </Text>
                    <TooltipOnHover
                      label="Remove"
                      bgColor="red.600"
                    >
                      <IconButton
                        position="absolute"
                        top="3px"
                        right={1}
                        aria-label="remove-option"
                        icon={<NamedIcon name="close" color="black"/>}
                        bgColor="red.400"
                        _hover={{
                          bgColor: "red.500"
                        }}
                        _active={{
                          bgColor: "red.600"
                        }}
                        h={5}
                        w={5}
                        minW={5}
                        ml={2}
                        fontSize=".9rem"
                        onClick={rest.removeProps.onClick && rest.removeProps.onClick as any}
                        onMouseDown={rest.removeProps.onMouseDown && rest.removeProps.onMouseDown as any}
                        onTouchEnd={rest.removeProps.onTouchEnd && rest.removeProps.onTouchEnd as any}
                      />
                    </TooltipOnHover>
                  </Box>
                );
              }
            }}
          />
        </Box>
        { error && <Text
          mt={1}
          color="red.400"
        >
          {error.message}
        </Text> }
      </Box>
    </>
  );
};

export { Select };


import { RangeSlider, RangeSliderFilledTrack, RangeSliderProps, RangeSliderThumb, RangeSliderTrack } from "@chakra-ui/react";

function RangerInput({ ...rest }: RangeSliderProps) {
  return (
    <RangeSlider
      aria-label={["min", "max"]}
      min={0}
      my={5}
      mt={5}
      {...rest}
    >
      <RangeSliderTrack h={7} bgColor="solid.100">
        <RangeSliderFilledTrack bgColor="solid.200"/>
      </RangeSliderTrack>
      <RangeSliderThumb borderRadius={0} w={3} h={8} bgColor="solid.500" index={0}/>
      <RangeSliderThumb borderRadius={0} w={3} h={8} bgColor="solid.500" index={1}/>
    </RangeSlider>
  );
};

export { RangerInput };


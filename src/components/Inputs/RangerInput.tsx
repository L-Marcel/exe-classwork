import { RangeSlider, RangeSliderFilledTrack, RangeSliderProps, RangeSliderThumb, RangeSliderTrack } from "@chakra-ui/react";

function RangerInput({ ...rest }: RangeSliderProps) {
  return (
    <RangeSlider
      aria-label={["min", "max"]}
      colorScheme="solid"
      min={0}
      my={5}
      mt={5}
      {...rest}
    >
      <RangeSliderTrack>
        <RangeSliderFilledTrack/>
      </RangeSliderTrack>
      <RangeSliderThumb index={0}/>
      <RangeSliderThumb index={1}/>
    </RangeSlider>
  );
};

export { RangerInput };


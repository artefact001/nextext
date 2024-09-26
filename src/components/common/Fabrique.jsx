import { Box, Image, Text } from '@chakra-ui/react';
import React from 'react';

const LocationItem = ({ imageSrc, nom }) => {
  return (
    <Box >
      {/* <Image loading="lazy" src={imageSrc} alt={`${locationName} location icon`}  /> */}
      <Text>{nom}</Text>
    </Box>
  );
};

export default LocationItem;
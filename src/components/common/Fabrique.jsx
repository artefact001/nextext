import { Box, Image, Text } from '@chakra-ui/react';
import React from 'react';

const LocationItem = ({ imageSrc, locationName }) => {
  return (
    <Box >
      <Image loading="lazy" src={imageSrc} alt={`${locationName} location icon`}  />
      <Text>{locationName}</Text>
    </Box>
  );
};

export default LocationItem;
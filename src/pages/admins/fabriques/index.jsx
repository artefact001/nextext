import LocationItem from '../../../components/common/Fabrique';
import React from 'react';
import {  Flex } from '@chakra-ui/react';



const locations = [
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/4ab18d4eb620294560328c98d7834f71abf167307ffbe85a4a9b42def28b575c?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b", name: "Liberte 6" },
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d342933f84042e5b4daaedaf45ebb61a9a2f8b2b1e099e5efb139beb878de1a3?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b", name: "Pikine" },
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/214ec23d3749dcb379f39120c1045d260a9de80402dc629e25b1c4c273a610c5?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b", name: "Liberte 6" },
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/8dc195973f9a70ec5c3f94adf89a1118bffacd8baf50d2d1a42dcc0ef659b75e?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b", name: "Mermoz" },
  { imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/92c68427470399018d2c4520f84e9489ed48d5e5373705583554f3b3e6c21d94?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b", name: "Liberte 6" }
];

const LocationList = () => {
  return (
    <Flex
      direction="column"
      fontSize="lg"
      letterSpacing="normal"
      textAlign="center"
      color="black"
      maxW="763px"
    >
      <Flex
        wrap="wrap"
        gap={10}
        align="flex-start"
        px={{ base: 5, md: 20 }}
        pt={3}
        pb={6}
        w="full"
        bg="whiteAlpha.80"
        borderRadius="xl"
        boxShadow="0px 1px 10px rgba(0,0,0,0.26)"
      >
        {locations.map((location, index) => (
          <LocationItem key={index} imageSrc={location.imageSrc} locationName={location.name} />
        ))}
      </Flex>
    </Flex>
  );
};

export default LocationList;

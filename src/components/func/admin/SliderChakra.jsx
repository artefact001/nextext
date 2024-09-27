import { Box, Image, Text, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

const SliderChakra = ({ fabriques }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ITEMS_PER_SLIDE = 3;

  const handleNext = () => {
    if (currentIndex + ITEMS_PER_SLIDE < fabriques.length) {
      setCurrentIndex(currentIndex + ITEMS_PER_SLIDE);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - ITEMS_PER_SLIDE);
    }
  };

  const visibleFabriques = fabriques.slice(currentIndex, currentIndex + ITEMS_PER_SLIDE);

  return (
    <Box>
      {/* Slider content */}
      <Flex>
        {visibleFabriques?.length > 0 ? (
          visibleFabriques.map((fabrique) => (
            <Box key={fabrique.id} mx={2}>
              <Image
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4ab18d4eb620294560328c98d7834f71abf167307ffbe85a4a9b42def28b575c?placeholderIfAbsent=true&apiKey=5a4129e8dacc4e7b95518ebfcb6a026b"
                alt={fabrique.nom}
                boxSize="150px"
                borderRadius="md"
              />
              <Text textAlign="center">{fabrique.nom}</Text>
            </Box>
          ))
        ) : (
          <Text>Aucune formation disponible.</Text>
        )}
      </Flex>

      {/* Slider navigation buttons */}
      <Flex justifyContent="center" mt={4}>
        <Button onClick={handlePrev} isDisabled={currentIndex === 0} mr={2}>
          Précédent
        </Button>
        <Button
          onClick={handleNext}
          isDisabled={currentIndex + ITEMS_PER_SLIDE >= fabriques.length}
        >
          Suivant
        </Button>
      </Flex>
    </Box>
  );
};

export default SliderChakra;

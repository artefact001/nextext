import React from 'react';
import { Box, Image, Flex, Heading } from '@chakra-ui/react';

function AttendanceCalendar() {
  const calendarItems = [
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/5b15b9f6a05f8a2dcaee0b7716444b8b8451d4a07c1fe57f1eae7bd081c8f807?apiKey=5a4129e8dacc4e7b95518ebfcb6a026b&" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/17355fa4a014cc9927fb06dfd66b82537e554eecd63250375032bb443d6b16fe?apiKey=5a4129e8dacc4e7b95518ebfcb6a026b&" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a0418a40a126e71ed24f9f8539869fa6e123596ee674868258670f2d46329ef6?apiKey=5a4129e8dacc4e7b95518ebfcb6a026b&" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/13c3516d9fa895cc88c3685c1e813dd2db692af7447aa7230546fa7d99b20fba?apiKey=5a4129e8dacc4e7b95518ebfcb6a026b&" }
  ];

  return (
    <Box as="section" p={5}>
      <Flex align="center" gap={5} justify="space-between" maxW="full">
        <Image 
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9242410c-df7f-4391-897b-43c826410eea?apiKey=5a4129e8dacc4e7b95518ebfcb6a026b&"
          alt="Calendar Icon"
          boxSize="40px"
          borderRadius="md"
          bg="rose.700"
          shadow="lg"
          objectFit="contain"
        />
        <Heading as="h2" size="lg">
          Septembre
        </Heading>
      </Flex>

      <Flex gap={5} justify="space-between" mt={5}>
        {calendarItems.map((item, index) => (
          <Image
            key={index}
            loading="lazy"
            src={item.src}
            alt={`Calendar item ${index + 1}`}
            boxSize="71px"
            objectFit="contain"
            shadow="md"
            borderRadius="md"
          />
        ))}
      </Flex>
    </Box>
  );
}

export default AttendanceCalendar;

import React from 'react';
import { Box, Center, Flex, Text } from '@chakra-ui/react';

function AttendanceSummary() {
  const summaryItems = [
    { label: "Absent", value: "02" },
    { label: "Retard", value: "03" }
  ];

  return (
    <Center>
    <Flex
      gap={10}
      justify="center"
      mt={9}
      maxW="full"
      textAlign="center"
      color="white"
      w="225px"
    >
      {summaryItems.map((item, index) => (
        <Box
          key={index}
          flex="1"
          px={4}
          pb={6}
          borderWidth="2px"
          borderColor="red.700"
          bg="gray.900"
          borderRadius="lg"
          textAlign="center"
        >
          <Text
            px={2}
            py={1}
            fontSize="xs"
            bg="red.700"
            borderRadius="md"
          >
            {item.label}
          </Text>
          <Text
            mt={5}
            fontSize="xl"
            fontWeight="bold"
          >
            {item.value}
          </Text>
        </Box>
      ))}
    </Flex>
    </Center>
  );
}

export default AttendanceSummary;

import { Box, Flex, Image, Text } from '@chakra-ui/react';

function AttendanceList() {
  const attendanceData = [
    { day: "Vendredi", date: "30/08", time: "9:10", status: "present" },
    { day: "Jeudi", date: "29/08", time: "9:05", status: "present" },
    // Additional attendance records...
  ];

  return (
    <Box as="section" mt={6} bg="white" borderRadius="xl" borderWidth="1px">
      {attendanceData.map((item, index) => (
        <Flex key={index} gap={3} align="center" py={3} px={4}>
          <Image src={`https://example.com/status-${item.status}.jpg`} alt={item.status} boxSize="22px" />
          <Flex flex="1" flexDir="column">
            <Text fontSize="md" fontWeight="bold">{item.day}</Text>
            <Text fontSize="sm">{item.date}</Text>
          </Flex>
          <Text fontSize="md" fontWeight="medium">{item.time}</Text>
        </Flex>
      ))}
    </Box>
  );
}

export default AttendanceList;

import React from 'react';
import { Box, Heading, List } from '@chakra-ui/react';
import AttendanceItem from './AttendanceItem';

function ListePointage({ pointages }) {
  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      px={2}
      py={8}
      mt={16}
      mx="auto"
      w="full"
      maxW={{ base: '366px', md: '700px', lg: '900px' }}  // Responsive width for mobile, tablet, and desktop
      borderBottom="2px solid"
      borderTop="2px solid"
      borderColor="red.700"
      borderRadius="md"
      shadow="lg"
      bg="whiteAlpha.80"
      fontFamily="Nunito Sans"
    >
      <Heading
        as="h2"
        size={{ base: 'md', md: 'lg' }} // Smaller heading size on mobile, larger on desktop
        textAlign="center"
        color="red.700"
        mb={8}
        fontFamily="Nunito Sans"

      >
        Aujourd'hui
      </Heading>

      <List
        spacing={4}
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="xl"
        boxShadow="sm"
      >
        {pointages.map((pointage) => (
            <AttendanceItem
                key={pointage.id}
                name={`${pointage.user.prenom} ${pointage.user.nom}`} // Concatenate first and last names
                role={pointage.user.role}
                time={pointage.heure_present}
                status={pointage.type} // Assuming `type` is either 'present', 'retard', or 'absent'
            />
        ))}
      </List>
    </Box>
  );
}

export default ListePointage;

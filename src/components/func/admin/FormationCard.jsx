import { Flex, Text, Box, Icon, Grid, ButtonGroup } from '@chakra-ui/react';
import React from 'react';
import { FaUsers } from 'react-icons/fa';

const FormationCard = ({ imageUrl, title, description, location }) => (
 

  <Grid
 spacing={10}
         >
    
    <Box
    // onClick={() => handlePromoClick(promo.id)}
      // key={promo.id}
        minWidth='max-content'
     alignItems='center' gap='2'
      w="100%" 
      maxW={{ base: '366px', md: '12vh', lg: '100%' }}

      h="16"
      bg="whiteAlpha.80"
      shadow="1px 0px 6px 2px rgba(0,0,0,0.25)"
      p="2"
      border="1px solid white"

      my={2}
      justifyContent="space-between"
      display="flex"
      cursor="pointer"
      borderColor="gray.200" // Lighter border for better UX
    >
      {/* Icon */}
      <ButtonGroup gap='2'>

      <Flex
        justifyContent="center"
        alignItems="center"
        w="12"
        h="12"
        bg="red.700"
        borderRadius="full"
        color="white"
      >
        <Icon as={FaUsers} boxSize={6} />
      </Flex>

      {/* Text Information */}
      <Box ml="4">
        <Text fontSize="lg" fontWeight="bold" fontFamily="Nunito Sans">
        {title}
        </Text>
        <Text fontSize="sm"  fontFamily="Nunito Sans">
        {description}
        </Text>
      </Box>
      </ButtonGroup>

     

    </Box>

    </Grid>
  );

export default FormationCard;
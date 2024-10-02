import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa"; // Import an icon for the user group

const PromoCard = ({ promos, handlePromoClick, isCompleted = false }) => {
  return (
    <Box shadow="md" borderWidth="1px" borderRadius="lg" p={5} mt={5}>
    <Text fontSize="2xl" fontWeight="bold" mb={5}>
      {isCompleted ? 'Terminées' : 'En cours'}
    </Text>
    {promos.map((promo) => (

    <Box
    onClick={() => handlePromoClick(promo.id)}
      key={promo.id}
      w="100%" 
      h="16"
      bg="whiteAlpha.80"
      borderRadius="md"
      boxShadow="2xl"
      shadow="xl"
      p="4"
      my={2}
      display="flex"
      alignItems="center"
      cursor="pointer"
      border="1px solid"
      borderColor="gray.200" // Lighter border for better UX
    >
      {/* Icon */}
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
        {promo.nom}        </Text>
        <Text fontSize="sm" color="gray.600" fontFamily="Nunito Sans">
        {promo.fabrique && promo.fabrique.nom ? promo.fabrique.nom : 'Fabrique inconnue'}
        </Text>
      </Box>

    </Box>
        ))}
    </Box>


  );
};

export default PromoCard;

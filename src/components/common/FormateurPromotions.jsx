import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';

const FormateurPromotions = ({ formateur ,  isCompleted = false }) => {
  if (!formateur) {
    return <Text>Sélectionnez un formateur pour voir ses promotions.</Text>;
  }

  const { promos_chef_de_projet, promos_foramateur, role } = formateur;

  const promotions = role === 'ChefDeProjet' ? promos_chef_de_projet : promos_foramateur;

  return (
    <>
    <Box shadow="md" borderWidth="1px" borderRadius="lg" p={5} mt={5}>
    <Text fontSize="2xl" fontWeight="bold" mb={5}>
      {isCompleted ? 'Terminées' : 'En cours'}
    </Text>
    {promotions && promotions.length > 0 ? (

    promotions.map((promo) => (
      <Link href={`/admins/promos/${promo.id}`} key={promo.id}>

    <Box
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
        {promo.nom}         </Text>
      </Box>

    </Box>
    </Link>
  ))
) : (
  <Text>Aucune promotion disponible.</Text>
)}
    </Box>
   
    </>
  );
};

export default FormateurPromotions;

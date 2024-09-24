import React, { useState, useEffect } from 'react';
import {
  Box,
  Center,
  Text,
  Avatar,
  Button,
  Input,
  SimpleGrid,
} from '@chakra-ui/react';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';

export default function ProfileComponent() {
  const { user } = useUserWithRoles(['Apprenant']); // Spécifie ici les rôles requis

  // États pour gérer les valeurs des champs de profil
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');

  // Utiliser useEffect pour mettre à jour les états quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setAdresse(user.adresse || '');
      setTelephone(user.telephone || '');
      setPassword(''); // Ne pas charger le mot de passe pour des raisons de sécurité
    }
  }, [user]);

  // Fonction pour gérer la mise à jour des informations
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/update/information`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adresse,
            telephone,
            // password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Profil mis à jour avec succès !');
      } else {
        alert('Erreur lors de la mise à jour : ' + JSON.stringify(data.errors));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
      alert('Une erreur est survenue lors de la mise à jour.');
    }
  };

  if (!user) {
    return <Center>Chargement des informations utilisateur...</Center>;
  }

  return (
    <SimpleGrid
      columns={1}
      spacing={8}
      bg="whiteAlpha.80"
      justifyContent="center"
      p={4}
    >
      {/* Profile Section */}
      <Center
        mt={6}
        flexDirection="column"
        w={{ base: '366px', md: '100%', lg: '100%' }}
      >
        <Avatar
          size="xl"
          name={user?.nom}
          src={user?.photo_profile || 'path/to/default-profile-image.jpg'}
        />
        <Text fontSize="xl" mt={4}>
          {user?.email}
        </Text>
      </Center>

      {/* Profile Details */}
      <Center mt={6} flexDirection="column">
        <Box
          w={{ base: '366px', md: '100%', lg: '50%' }}
          bg="whiteAlpha.80"
          p={4}
          borderRadius="md"
        >
          <Text fontWeight="bold">Adresse</Text>
          <Input
            type="text"
            placeholder="Entrez votre adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            focusBorderColor="red.500"
          />
        </Box>
        <Box
          w={{ base: '366px', md: '100%', lg: '50%' }}
          bg="whiteAlpha.80"
          p={4}
          borderRadius="md"
          mt={4}
        >
          <Text fontWeight="bold">Téléphone</Text>
          <Input
            type="tel"
            placeholder="Entrez votre téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            focusBorderColor="red.500"
          />
        </Box>
        <Box
          w={{ base: '366px', md: '100%', lg: '50%' }}
          bg="whiteAlpha.80"
          p={4}
          borderRadius="md"
          mt={4}
        >
          <Text fontWeight="bold">Mot de passe</Text>
          <Input
            type="password"
            placeholder="Entrez un nouveau mot de passe (facultatif)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            focusBorderColor="red.500"
          />
        </Box>
      </Center>

      {/* Update Button */}
      <Center mt={6}>
        <Button
          w={{ base: '366px', md: '100%', lg: '50%' }}
          bg="#CE0033"
          color="white"
          size="lg"
          onClick={handleUpdate}
        >
          Mise à jour
        </Button>
      </Center>
    </SimpleGrid>
  );
}

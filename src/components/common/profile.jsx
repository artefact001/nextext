import React, { useState, useEffect } from 'react';
import { Box, Center, Text, Avatar, Button, Input, IconButton } from '@chakra-ui/react';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';
import { FiCamera } from 'react-icons/fi'; // Import an icon for the pin
import Swal from 'sweetalert2';

export default function ProfileComponent() {
  const { user } = useUserWithRoles(['Formateur', 'ChefDeProjet','Apprenant','Vigile', 'Administrateur']);

  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [photoProfile, setPhotoProfile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setAdresse(user.adresse || '');
      setTelephone(user.telephone || '');
      setPhotoProfile(user.photo_profile || '');
      setPassword('');
      setConfirmPassword('');
    }
  }, [user]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageClick = () => {
    document.getElementById('image-upload').click(); // Trigger the file input on click
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors({});

    if (password && password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: ['Les mots de passe ne correspondent pas.'],
      }));
      return;
    }

    const formData = new FormData();
    formData.append('adresse', adresse);
    formData.append('telephone', telephone);
    if (password) formData.append('password', password);
    if (imageFile) formData.append('photo_profile', imageFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update/information`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Succès!',
          text: 'Profil mis à jour avec succès!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        // fresh le component




      } else {
        setErrors(data.errors || {});
        Swal.fire({
          title: 'Erreur!',
          text: 'Erreur lors de la mise à jour',
          icon: 'error',
          confirmButtonText: 'Réessayer',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Une erreur est survenue lors de la mise à jour.',
        icon: 'error',
        confirmButtonText: 'Réessayer',
      });
    }
  };

  if (!user) {
    return <Center>Chargement des informations utilisateur...</Center>;
  }

  return (
    <Box bg="whiteAlpha.80" w={{ base: '366px', md: '100%', lg: '100%' }} p={4}>
      <form onSubmit={handleUpdate}>
        {/* Profile Section */}
        <Center mt={6} flexDirection="column">
          <Box position="relative" display="inline-block">
            <Avatar
              size="2xl"
              name={user?.nom}
              src={user?.photo_profile ? `${process.env.NEXT_PUBLIC_API_IMAGE}/${user.photo_profile}` : 'path/to/default-profile-image.jpg'}
              onClick={handleImageClick} // Handle click on the avatar
              cursor="pointer"
              border="4px solid #CE0033"
            />
            {/* Pin Icon */}
            <IconButton
              aria-label="Change profile picture"
              icon={<FiCamera />}
              position="absolute"
              bottom="0"
              right="0"
              size="xl"
              fontWeight='bold'              onClick={handleImageClick}
              bg="gray.600"
              color="white"
              borderRadius="full"
              _hover={{ bg: 'gray.500' }}
            />
          </Box>

          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            display="none" // Hide the file input
          />

          <Text fontSize="xl" mt={4}>
            {user?.email}
          </Text>
        </Center>

        {/* Profile Details */}
        

       

        <Box bg="whiteAlpha.80" p={4}   mt={4}>
          <Text fontWeight="bold">Adresse</Text>
          <Input
            type="text"
            placeholder="Entrez votre adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            focusBorderColor="#CE0033"
            border="0"
            borderBottom='2px'
          />
          {errors.adresse && <Text color="#CE0033">{errors.adresse[0]}</Text>}
        </Box>

        <Box bg="whiteAlpha.80" p={4}   mt={4}>
          <Text fontWeight="bold">Téléphone</Text>
          <Input
            type="tel"
            placeholder="Entrez votre téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            focusBorderColor="#CE0033"
             border="0"
            borderBottom='2px'
          />
          {errors.telephone && <Text color="#CE0033">{errors.telephone[0]}</Text>}
        </Box>

        {/* Image Upload */}
        

        <Box bg="whiteAlpha.80" p={4}   mt={4}>
          <Text fontWeight="bold">Mot de passe</Text>
          <Input
            type="password"
            placeholder="Entrez un nouveau mot de passe (facultatif)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            focusBorderColor="#CE0033"
            border="0"
            borderBottom='2px'

          />
          {errors.password && <Text color="#CE0033">{errors.password[0]}</Text>}
        </Box>

        <Box bg="whiteAlpha.80" p={4}   mt={4}>
          <Text fontWeight="bold">Confirmer le mot de passe</Text>
          <Input
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            focusBorderColor="#CE0033"
            border="0"
            borderBottom='2px'
          />
          {errors.confirmPassword && (
            <Text color="#CE0033">{errors.confirmPassword[0]}</Text>
          )}
        </Box>

        {/* Add other fields here similarly */}

        {/* Update Button */}
        <Center mt={6}>
          <Button color="white" bg="#CE0033" size="lg" type="submit">
            Mise à jour
          </Button>
        </Center>
      </form>
    </Box>
  );
}

import { useState } from 'react';
import { Center, Button, Input, FormControl, FormLabel, Box, Text, Select } from '@chakra-ui/react';

const InscrireApprenantForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    email: '',
    password: '',
    photo_profile: '',
    sexe: '',
    promotion_id: ''
  });
  
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/apprenant/inscrire`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Important pour indiquer que les données sont en JSON
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Token JWT
          },
          body: JSON.stringify(formData), // Convertit formData en JSON
        }
      );
  
      const data = await response.json(); // Parse la réponse en JSON
  
      if (response.ok) {
        setMessage('Apprenant inscrit avec succès !');
        setFormData({
          nom: '',
          prenom: '',
          adresse: '',
          telephone: '',
          email: '',
          password: '',
          photo_profile: '',
          sexe: '',
          promotion_id: ''
        });
      } else {
        // Gérer les erreurs de validation et les erreurs générales
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: 'Une erreur est survenue.' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue lors de l\'inscription.' });
    }
  };
  

  return (
    <Center display={'block'}>
      <Box mt={5} p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="100%" maxWidth="500px">
        <form onSubmit={handleSubmit}>
          <FormControl id="nom" mb={4} isRequired isInvalid={errors.nom}>
            <FormLabel>Nom</FormLabel>
            <Input name="nom" type="text" placeholder="Nom" value={formData.nom} onChange={handleChange} />
            {errors.nom && <Text color="red.500">{errors.nom}</Text>}
          </FormControl>

          <FormControl id="prenom" mb={4} isRequired isInvalid={errors.prenom}>
            <FormLabel>Prénom</FormLabel>
            <Input name="prenom" type="text" placeholder="Prénom" value={formData.prenom} onChange={handleChange} />
            {errors.prenom && <Text color="red.500">{errors.prenom}</Text>}
          </FormControl>

          <FormControl id="adresse" mb={4} isRequired isInvalid={errors.adresse}>
            <FormLabel>Adresse</FormLabel>
            <Input name="adresse" type="text" placeholder="Adresse" value={formData.adresse} onChange={handleChange} />
            {errors.adresse && <Text color="red.500">{errors.adresse}</Text>}
          </FormControl>

          <FormControl id="telephone" mb={4} isRequired isInvalid={errors.telephone}>
            <FormLabel>Téléphone</FormLabel>
            <Input name="telephone" type="text" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} />
            {errors.telephone && <Text color="red.500">{errors.telephone}</Text>}
          </FormControl>

          <FormControl id="email" mb={4} isRequired isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && <Text color="red.500">{errors.email}</Text>}
          </FormControl>

          <FormControl id="password" mb={4} isRequired isInvalid={errors.password}>
            <FormLabel>Mot de passe</FormLabel>
            <Input name="password" type="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
            {errors.password && <Text color="red.500">{errors.password}</Text>}
          </FormControl>

          <FormControl id="photo_profile" mb={4} isInvalid={errors.photo_profile}>
            <FormLabel>Photo de profil (URL)</FormLabel>
            <Input name="photo_profile" type="text" placeholder="URL de la photo de profil" value={formData.photo_profile} onChange={handleChange} />
            {errors.photo_profile && <Text color="red.500">{errors.photo_profile}</Text>}
          </FormControl>

          <FormControl id="sexe" mb={4} isRequired isInvalid={errors.sexe}>
            <FormLabel>Sexe</FormLabel>
            <Select name="sexe" placeholder="Sélectionner le sexe" value={formData.sexe} onChange={handleChange}>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
            </Select>
            {errors.sexe && <Text color="red.500">{errors.sexe}</Text>}
          </FormControl>

          <FormControl id="promotion_id" mb={4} isInvalid={errors.promotion_id}>
            <FormLabel>ID de la promotion</FormLabel>
            <Input name="promotion_id" type="text" placeholder="Promotion ID" value={formData.promotion_id} onChange={handleChange} />
            {errors.promotion_id && <Text color="red.500">{errors.promotion_id}</Text>}
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Inscrire Apprenant
          </Button>
        </form>

        {message && (
          <Text mt={4} color="green.500">
            {message}
          </Text>
        )}
        {errors.general && (
          <Text mt={4} color="red.500">
            {errors.general}
          </Text>
        )}
      </Box>
    </Center>
  );
};

export default InscrireApprenantForm;

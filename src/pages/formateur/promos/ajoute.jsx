import { useState, useEffect } from 'react';
import { Center, Button, Box, Text, Select } from '@chakra-ui/react';
import FormInput from '../../../components/common/FormInput';
import ProfileCardFormateur from '../../../components/layout/formateur/Navbar';

const CreatePromoForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    date_debut: '',
    date_fin: '',
    fabrique_id: '',
    chef_projet_id: '',
    formation_id: '',
    formateur_id: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [fabriques, setFabriques] = useState([]);
  const [chefsProjets, setChefsProjets] = useState([]);
  const [formations, setFormations] = useState([]);

  const getCurrentUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData(prevFormData => ({
          ...prevFormData,
          formateur_id: data.user.id,
        }));
      } else {
        setErrors({ general: 'Erreur lors de la récupération des informations utilisateur.' });
      }
    } catch (error) {
      setErrors({ general: 'Erreur lors de la récupération des informations utilisateur.' });
    }
  };

  const fetchOptions = async () => {
    try {
      const [fabriquesRes, chefsProjetsRes, formationsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/fabriques`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/chefs-projet`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/formations`)
      ]);

      if (fabriquesRes.ok) setFabriques(await fabriquesRes.json());
      if (chefsProjetsRes.ok) setChefsProjets(await chefsProjetsRes.json());
      if (formationsRes.ok) setFormations(await formationsRes.json());
    } catch (error) {
      setErrors({ general: 'Erreur lors de la récupération des options.' });
    }
  };

  useEffect(() => {
    getCurrentUser();
    fetchOptions();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Le nom est requis.';
    if (!formData.date_debut) newErrors.date_debut = 'La date de début est requise.';
    if (!formData.date_fin) newErrors.date_fin = 'La date de fin est requise.';
    if (!formData.fabrique_id) newErrors.fabrique_id = 'Veuillez sélectionner une fabrique.';
    if (!formData.chef_projet_id) newErrors.chef_projet_id = 'Veuillez sélectionner un chef de projet.';
    if (!formData.formation_id) newErrors.formation_id = 'Veuillez sélectionner une formation.';
    
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Promotion créée avec succès !');
        setFormData({
          nom: '',
          date_debut: '',
          date_fin: '',
          fabrique_id: '',
          chef_projet_id: '',
          formation_id: '',
          formateur_id: user?.id || '',
        });
      } else {
        setErrors(data.errors || { general: 'Une erreur est survenue.' });
      }
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue lors de la création de la promotion.' });
    }
  };

  return (
    <Center display="block">
      <ProfileCardFormateur />

      <Box mt={5} p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="100%" maxWidth="500px">
        <form onSubmit={handleSubmit}>
          <FormInput
            id="nom"
            label="Nom"
            name="nom"
            type="text"
            placeholder="Nom de la promotion"
            value={formData.nom}
            onChange={handleChange}
            error={errors.nom}
          />
          {errors.nom && <Text color="red.500">{errors.nom}</Text>}

          <FormInput
            id="date_debut"
            label="Date de début"
            name="date_debut"
            type="date"
            value={formData.date_debut}
            onChange={handleChange}
            error={errors.date_debut}
          />
          {errors.date_debut && <Text color="red.500">{errors.date_debut}</Text>}

          <FormInput
            id="date_fin"
            label="Date de fin"
            name="date_fin"
            type="date"
            value={formData.date_fin}
            onChange={handleChange}
            error={errors.date_fin}
          />
          {errors.date_fin && <Text color="red.500">{errors.date_fin}</Text>}

          <Select
            id="fabrique_id"
            name="fabrique_id"
            placeholder="Sélectionnez une fabrique"
            value={formData.fabrique_id}
            onChange={handleChange}
            isInvalid={errors.fabrique_id}
          >
            {fabriques.map(fabrique => (
              <option key={fabrique.id} value={fabrique.id}>
                {fabrique.nom}
              </option>
            ))}
          </Select>
          {errors.fabrique_id && <Text color="red.500">{errors.fabrique_id}</Text>}

          <Select
            id="chef_projet_id"
            name="chef_projet_id"
            placeholder="Sélectionnez un chef de projet"
            value={formData.chef_projet_id}
            onChange={handleChange}
            isInvalid={errors.chef_projet_id}
          >
            {chefsProjets.map(chef => (
              <option key={chef.id} value={chef.id}>
                {chef.nom}
              </option>
            ))}
          </Select>
          {errors.chef_projet_id && <Text color="red.500">{errors.chef_projet_id}</Text>}

          <Select
            id="formation_id"
            name="formation_id"
            placeholder="Sélectionnez une formation"
            value={formData.formation_id}
            onChange={handleChange}
            isInvalid={errors.formation_id}
          >
            {formations.map(formation => (
              <option key={formation.id} value={formation.id}>
                {formation.nom}
              </option>
            ))}
          </Select>
          {errors.formation_id && <Text color="red.500">{errors.formation_id}</Text>}

          <Button type="submit" colorScheme="blue" width="full">
            Créer Promotion
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

export default CreatePromoForm;

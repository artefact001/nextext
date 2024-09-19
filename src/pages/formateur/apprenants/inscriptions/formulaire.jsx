import { useState } from 'react';
import { Center, Button, Box, FormErrorMessage } from '@chakra-ui/react';
import FormInput from '../../../../components/common/FormInput';
import FormSelect from '../../../../components/common/FormSelect';


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
    // Refaire la validation en temps réel si nécessaire
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
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        }
      );
  
      const data = await response.json();
  
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
          <FormInput id="nom" label="Nom" name="nom" type="text" placeholder="Nom" value={formData.nom} onChange={handleChange} error={errors.nom} />
          <FormInput id="prenom" label="Prénom" name="prenom" type="text" placeholder="Prénom" value={formData.prenom} onChange={handleChange} error={errors.prenom} />
          <FormInput id="adresse" label="Adresse" name="adresse" type="text" placeholder="Adresse" value={formData.adresse} onChange={handleChange} error={errors.adresse} />
          <FormInput id="telephone" label="Téléphone" name="telephone" type="text" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} error={errors.telephone} />
          <FormInput id="email" label="Email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} error={errors.email} />
          <FormInput id="password" label="Mot de passe" name="password" type="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} error={errors.password} />
          <FormInput id="photo_profile" label="Photo de profil (URL)" name="photo_profile" type="text" placeholder="URL de la photo de profil" value={formData.photo_profile} onChange={handleChange} error={errors.photo_profile} />
          <FormSelect
            id="sexe"
            label="Sexe"
            name="sexe"
            value={formData.sexe}
            onChange={handleChange}
            options={[
              { value: 'homme', label: 'Homme' },
              { value: 'femme', label: 'Femme' }
            ]}
            error={errors.sexe}
          />
          <FormInput id="promotion_id" label="ID de la promotion" name="promotion_id" type="text" placeholder="Promotion ID" value={formData.promotion_id} onChange={handleChange} error={errors.promotion_id} />
          <Button type="submit" colorScheme="blue" width="full">
            Inscrire Apprenant
          </Button>
        </form>

        <FormErrorMessage message={message} />
        <FormErrorMessage message={errors.general} />
      </Box>
    </Center>
  );
};

export default InscrireApprenantForm;

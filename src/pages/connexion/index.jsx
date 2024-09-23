import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../lib/utils/api';
  
import { Box, Button, Center, FormControl, FormLabel, Input, Heading, Image, useToast } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Réinitialise les erreurs à chaque soumission

    try {
      // Appel API pour le login
      const response = await api('login', 'POST', { email, password });

      if (response.errors || response.message || response.error) {
        // En cas d'erreur, affiche le message provenant du backend
        setError(
          response.errors?.email?.[0] || response.message || response.error
        );
      } else if (response.access_token) {
        // Si l'authentification réussit, stocke le token dans le localStorage
        localStorage.setItem('token', response.access_token);
        toast({
          title: 'Connexion réussie.',
          description: "Vous êtes connecté.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Appel de l'API pour récupérer le rôle de l'utilisateur
        const roleResponse = await api(
          'user/role',
          'GET',
          null,
          response.access_token
        );

        if (roleResponse.role) {
          // Redirection en fonction du rôle de l'utilisateur
          switch (roleResponse.role) {
            case 'Formateur':
              router.push('/formateur');
              break;
            case 'Apprenant':
              router.push('/apprenant');
              break;
            case 'Vigile':
              router.push('/vigile/scanner');
              break;
            case 'Chef de projet':
              router.push('/chef-de-projet');
              break;
            case 'Administrateur':
              router.push('/admins');
              break;
            default:
              setError(
                "Rôle non reconnu. Veuillez contacter l'administrateur."
              );
          }
        } else {
          setError('Impossible de récupérer le rôle utilisateur.');
        }
      } else {
        setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
      }
    } catch (err) {
      console.error('Erreur lors de la requête', err);
      setError(
        'Erreur lors de la connexion. Veuillez vérifier vos informations et réessayer.'
      );
    }
  };

  return (

    <div>

<Heading as="h3" size="md" pt={20} textAlign="center" mb={-3}>
          Bienvenue dans la page de connexion
        </Heading>
    
  
      <Center minH="100vh" mx={5}         bg="whiteAlpha.80"
      >
        
      <Box   w="full" 
  maxW="sm" 
  p={6} 
  bg="whiteAlpha.80"
  rounded="lg" 
  borderTop="2px" 
  borderBottom="2px"
    borderColor="#CE0033" 
    // borderColor="red" // Utilisation de la couleur définie dans le thème

  shadow="lg"
  >
        {/* Icon de verrou */}
        <Center mb={4}>
          <Image src="/path/to/your/lock-icon.png" alt="Lock icon" boxSize="64px" />
        </Center>

        {/* Titre de la page */}
        

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input 
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="red.500"
               shadow="lg"
            />
          </FormControl>

          {/* Mot de passe */}
          <FormControl id="password" mb={6}>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="red.500"
               shadow="lg"
            />
          </FormControl>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Bouton de soumission */}
          <Button
            type="submit"
            w="full"
            bg="red.600"
            color="white"            
            size="lg"
            mt={4}
            _hover={{ bg: "red.600" }}
          >
            Connexion
          </Button>
        </form>
      </Box>
    </Center>
    </div>

  );
};

export default Login;

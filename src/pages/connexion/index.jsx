import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../lib/utils/api';
import { PiLockKeyOpenFill } from 'react-icons/pi';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
} from '@chakra-ui/react';

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
          description: 'Vous êtes connecté.',
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
            case 'ChefDeProjet':
              router.push('/ChefDeProjet');
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
    <div
      style={{
        backgroundImage: `
                                                                                                                                                      linear-gradient(rgba(250, 250, 250, 0.1), rgba(250, 250, 250, 0.4)),
                                                                                                                                                      url(/images/background-simplon-pattern.svg)
                                                                                                                                                    `,
        backgroundSize: 'cover', // Ensures the image covers the entire page
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents image repetition
      }}
    >
      <Heading as="h3" size="md" py={20} textAlign="center">
        Bienvenue dans la page de connexion
      </Heading>

      <Center h="100%" mx={5} bg="whiteAlpha.80">
        <Box
          w="full"
          maxW={{ base: 'sm', md: 'sm', lg: '' }}
          p={10}
          bg="whiteAlpha.80"
          rounded="lg"
          borderTop="2px"
          borderBottom="2px"
          borderColor="#CE0033"
          // borderColor="red" // Utilisation de la couleur définie dans le thème

          shadow="lg"
        >
          {/* Icon de verrou */}
          <Center  mb={4}>
            <PiLockKeyOpenFill size={46} />
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
              _hover={{ bg: 'red.600' }}
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

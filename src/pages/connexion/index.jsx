import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../lib/utils/api'; // Appel de l'API pour l'authentification
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // Vérifie si l'utilisateur est déjà connecté et redirige en fonction de son rôle
  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem('token'); // Utiliser localStorage ou sessionStorage
      if (token) {
        try {
          const roleResponse = await api('user/role', 'GET', null, token);
          if (roleResponse.role) {
            // Redirection en fonction du rôle
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
          }
        } catch (err) {
          console.error('Erreur lors de la récupération du rôle', err);
        }
      }
    };

    checkUserRole();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api('login', 'POST', { email, password });

      if (response.errors || response.message || response.error) {
        setError(
          response.errors?.email?.[0] || response.message || response.error
        );
      } else if (response.access_token) {
        localStorage.setItem('token', response.access_token); // Stocke le token

        document.cookie = `refresh_token=${response.refresh_token}; HttpOnly; Secure`; // Stocke le refresh token

        toast({
          title: 'Connexion réussie.',
          description: 'Vous êtes connecté.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Récupère le rôle de l'utilisateur après la connexion
        const roleResponse = await api('user/role', 'GET', null, response.access_token);
        if (roleResponse.role) {
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
      setError('Erreur lors de la connexion. Veuillez vérifier vos informations.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `
          linear-gradient(rgba(250, 250, 250, 0.1), rgba(250, 250, 250, 0.4)),
          url(/images/background-simplon-pattern.svg)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          shadow="lg"
        >
          <Center mb={4}>
            <PiLockKeyOpenFill size={46} />
          </Center>

          <form onSubmit={handleSubmit}>
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

            <Button
              type="submit"
              w="full"
              bg="red.600"
              color="white"
              size="lg"
              mt={4}
              isLoading={isLoading}
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

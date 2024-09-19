import { Box, Center } from '@chakra-ui/react';
import ProfileComponent from '../../components/func/formateur/profile';
import ProfileCardFormateur from '../../components/layout/formateur/Navbar';

const Profile = () => {
  return (
    <Center display={'block'}>
      <ProfileCardFormateur></ProfileCardFormateur>
      <Box
        mt={6}
        bg="whiteAlpha.80"
        p={4}
        borderRadius="md"
        shadow="md"
      >
        <ProfileComponent></ProfileComponent>
      </Box>
    </Center>
  );
};

export default Profile;

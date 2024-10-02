import { Box, Center } from '@chakra-ui/react';
import ProfileComponent from '../../components/common/profile';
import ProfileCardAdministrateur from '../../components/layout/admin/Navbar';

const Profile = () => {
  return (
    <Center display={'block'}>
      <ProfileCardAdministrateur />
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

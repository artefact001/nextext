import { Box, Center } from '@chakra-ui/react';
import ProfileCard from '../../components/layout/apprenant/Navbar';
import ProfileComponent from '../../components/common/profile';

const Profile = () => {
  return (
    <Center display={'block'}>
      <ProfileCard></ProfileCard>
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

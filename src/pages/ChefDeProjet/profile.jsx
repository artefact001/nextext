import { Box, Center, SimpleGrid } from '@chakra-ui/react';
import ProfileComponent from '../../components/common/profile';
import ProfileCardChefDeProjet from '../../components/layout/chefDeProjet/Navbar';
import CardBox from '../../components/common/Card';

const Profile = () => {
  return (
    <Center display={'block'}>
      <ProfileCardChefDeProjet/>
       <SimpleGrid columns={[1,1]}   >
      <CardBox
        mt={6}
        bg="whiteAlpha.80"
        borderRadius="md"
        shadow="md"
        mx={10 }
        w={{ base: '366px', md: '100%', lg: '100%' }}
        h="95%"
      >
        {/*  ProfileComponent*/}
        <ProfileComponent/>
        {/*  */}
      </CardBox>
      </SimpleGrid>
    </Center>
  );
};

export default Profile;

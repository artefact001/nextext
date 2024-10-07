import {  Center, SimpleGrid } from '@chakra-ui/react';
import ProfileComponent from '../../components/common/profile';
import ProfileCardAdministrateur from '../../components/layout/admin/Navbar';
import CardBox from '../../components/common/Card';
import CongeList from '../../components/func/admin/ListeConges';

const Profile = () => {
  return (
    <Center display={'block'}>
      <ProfileCardAdministrateur />
      <SimpleGrid columns={[1,2]}   >
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
        <CongeList/>
        {/*  */}
      </CardBox>
      </SimpleGrid>
    </Center>
  );
};

export default Profile;

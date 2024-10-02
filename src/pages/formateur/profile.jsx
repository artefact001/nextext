import {  Center } from '@chakra-ui/react';
import ProfileCardFormateur from '../../components/layout/formateur/Navbar';
import ProfileComponent from '../../components/common/profile';
import CardBox from '../../components/common/Card';

const Profile = () => {
  return (
    <Center display={'block'}>
      <ProfileCardFormateur></ProfileCardFormateur>
      <CardBox
        mt={6}
        bg="whiteAlpha.80"
        borderRadius="md"
        shadow="md"
        px={30}
        mx={10 }
      >
        <ProfileComponent></ProfileComponent>
      </CardBox>
    </Center>
  );
};

export default Profile;

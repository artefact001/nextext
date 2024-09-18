import { Center } from "@chakra-ui/react";
import ProfileCard from "../../components/layout/apprenant/Navbar";
import ProfileComponent from "../../components/func/apprenant";


const Profile = () => {
    return(

        <Center  display={'block'}>
            <ProfileCard></ProfileCard>
            <ProfileComponent   ></ProfileComponent>
        </Center>


    );
};

export default Profile 

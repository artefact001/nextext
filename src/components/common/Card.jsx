import { Box } from "@chakra-ui/react";

const CardBox = ({children, ...attrebuts}) => {
  return (
    <Box
    as="section"
    px={{ base: '2px', md: '30px', lg: '20px' }}
    mx={{ base: '2px', md: '1px', lg: 'auto' }}
    ml={{ base: '2px', md: '3px', lg: '20%' }}
    py={8}
    mt={7}
    w="full"
    maxW={{ base: '100%', md: '100%', lg: '55%' }}
    borderBottom="2px solid"
    borderTop="2px solid"
    borderColor="red.700"
    borderRadius="md"
    shadow="lg"
    bg="whiteAlpha.80"
    fontFamily="Nunito Sans"
    flex="2"
    {...attrebuts}
  >

      {children}
 


    </Box>


  );
};

export default CardBox;

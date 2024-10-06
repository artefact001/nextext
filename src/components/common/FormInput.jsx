import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';

const FormInput = ({ id, label, name, type, placeholder, value, onChange, error }) => {
  return (
    <FormControl id={id} mb={4} isRequired isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input  name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} w="100%" py={7} 
      shadow="1px 0px 4px 1px rgba(0,0,0,0.25)"
      _focus={{ border:'red' }}
      

      />{}
      {error && <Text color="red.500">{error}</Text>}
    </FormControl>
  );
};

export default FormInput;

import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';

const FormInput = ({ id, label, name, type, placeholder, value, onChange, error }) => {
  return (
    <FormControl id={id} mb={4} isRequired isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input shadow="lg" name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} w="100%" py={7} />
      {error && <Text color="red.500">{error}</Text>}
    </FormControl>
  );
};

export default FormInput;

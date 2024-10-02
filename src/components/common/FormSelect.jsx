import { FormControl, FormLabel, Select, Text } from '@chakra-ui/react';

const FormSelect = ({ id, label, name, value, onChange, options, error }) => {
  return (
    <FormControl id={id} mb={4} isRequired isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Select shadow="lg"  name={name} placeholder="Sélectionner"  h={14} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value} py={7}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && <Text color="red.500">{error}</Text>}
    </FormControl>
  );
};

export default FormSelect;

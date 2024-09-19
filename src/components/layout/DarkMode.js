import { Button, useColorMode } from '@chakra-ui/react';

export default function ThemeToggleButton() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode}>
      {colorMode === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
    </Button>
  );
}

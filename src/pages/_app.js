import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Head from 'next/head';
import { MediaContextProvider } from '../lib/utils/media';
import { ColorModeScript } from '@chakra-ui/react';

// Définir les couleurs personnalisées
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

// Configuration du mode sombre et clair
const config = {
  initialColorMode: 'light',  // Choisissez 'light' ou 'dark' comme mode par défaut
  useSystemColorMode: true,   // Permet de détecter le mode système (clair/sombre)
};

// Créer le thème avec les couleurs personnalisées et le mode de couleur
const theme = extendTheme({ colors, config });

// 3. Pass the `theme` prop to the `ChakraProvider`
function ApiDocs({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      {/* ColorModeScript permet d'assurer que le mode est conservé entre les rafraîchissements */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITENAME}</title>
      </Head>
      <MediaContextProvider>
        <Component {...pageProps} />
      </MediaContextProvider>
    </ChakraProvider>
  );
}

export default ApiDocs;

module.exports = {
  name: 'Components Messages',
  themeComponentsMessages: {
    header: {
      sitename: 'SIMPLON POINT',
    },
    errors: {
      default: 'Une erreur est survenue. Veuillez réessayer.',
      validation: {
        required: 'Ce champ est requis.',
        email: 'Veuillez entrer une adresse e-mail valide.',
        minLength: (min) => `Ce champ doit comporter au moins ${min} caractères.`,
      },
      server: 'Une erreur de serveur est survenue. Veuillez réessayer plus tard.',
    },
    success: {
      default: 'Opération réussie!',
    },
    info: {
      default: 'Information importante à noter.',
    },
  },
};

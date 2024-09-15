import { api } from '@utils/api'; // S'assurer que l'import du module `api` est correct

export const getUserWithRoles = async (context, requiredRoles = []) => {
    const token = context.req.cookies.token || null;

    if (!token) {
        return {
            props: { initialUser: null },
        };
    }

    try {
        const response = await api('user', 'GET', null, token);
        const { user, roles } = response;
        const roleNames = roles.map(r => r.name);

        // Vérifie si l'utilisateur a au moins un des rôles requis
        const hasRequiredRole = requiredRoles.some(role => roleNames.includes(role));

        if (hasRequiredRole) {
            return {
                props: { initialUser: user },
            };
        } else {
            return {
                props: { initialUser: null },
            };
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
        return {
            props: { initialUser: null },
        };
    }
};

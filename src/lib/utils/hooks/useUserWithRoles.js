import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../api';

export const useUserWithRoles = (requiredRoles = []) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true); // Ajouter un état de chargement
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api('user', 'GET', null, token);
                    const userData = response.user;
                    const userRoles = response.user.roles.map(r => r.name);

                    // Vérifie si l'utilisateur a les rôles requis
                    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

                    if (hasRequiredRole) {
                        setUser(userData);
                        setRoles(userRoles);
                    } else {
                        router.push('/unauthorized'); // Redirection si l'utilisateur n'a pas le bon rôle
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des données utilisateur', error);
                    router.push('/connexion'); // Redirection vers la page de connexion en cas d'erreur
                }
            } else {
                router.push('/connexion'); // Redirection si aucun token n'est trouvé
            }
            setLoading(false); // Fin du chargement
        };

        fetchUserData();
    }, [requiredRoles, router]);

    return { user, roles, loading }; // Inclure un état de chargement
};

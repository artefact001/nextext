import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { api } from '../api';

export const useUserWithRoles = (requiredRoles = []) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api('user', 'GET', null, token);
          const userData = response.user;
          const userRoles = response.user.roles.map(r => r.name);

          setUser(userData);
          setRoles(userRoles);
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur', error);
          setError('Erreur de chargement des données utilisateur.');
          router.push('/connexion');
        }
      } else {
        router.push('/connexion');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  // Utilisation de useMemo pour mémoriser les rôles et la vérification des rôles requis
  const hasRequiredRole = useMemo(() => {
    return requiredRoles.some(role => roles.includes(role));
  }, [roles, requiredRoles]);

  useEffect(() => {
    if (!loading && !hasRequiredRole) {
      router.push('/unauthorized');
    }
  }, [loading, hasRequiredRole, router]);

  return { user, roles, loading, error };
};

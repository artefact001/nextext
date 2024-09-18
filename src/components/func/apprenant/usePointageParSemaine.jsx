import { useState, useEffect } from 'react';

const usePointageParSemaine = (user) => {
  const [pointages, setPointages] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPointages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pointages/semaines`, {
          headers: {
            Authorization: `Bearer ${user}`, // Le token JWT ou token d'authentification
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des pointages');
        }
        const data = await response.json();
        setPointages(data.pointages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPointages();
  }, [user]);

  return { pointages, error, loading };
};

export default usePointageParSemaine;

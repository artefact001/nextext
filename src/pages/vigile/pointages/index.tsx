import { useState, useEffect } from 'react';
import ListePointage from '../../../components/func/vigile/ListePointage';
import NavbarVigile from '../../../components/layout/vigile/Navbar';

export default function PointageAujourdhui() {
  const [pointages, setPointages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPointages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pointages/all`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la récupération des pointages.');
        }

        setPointages(data.pointages);
        setLoading(false);

        
      } catch (error) {
        setError(error.message);
        setLoading(false);

       
      }
    };

    fetchPointages();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Chargement des pointages...</p>
      ) : error ? (
        <p>Erreur : {error}</p>
      ) : pointages.length === 0 ? (
        <p>Aucun pointage pour aujourd&aposhui.</p>
      ) : (
        <ListePointage pointages={pointages} />
      )}

      <NavbarVigile /> 
    </div>
  );
}

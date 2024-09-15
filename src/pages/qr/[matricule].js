'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Importer le useRouter
import Image from 'next/image';
import { getUserWithRoles } from '../../lib/utils/checkRole';

const EtudiantPage = () => {
  const router = useRouter();
  const { matricule } = router.query; // Récupérer matricule depuis les paramètres de l'URL

  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQRCode = async () => {
      if (matricule) {
        // Vérifier si le matricule est disponible
        try {
          const url = `http://127.0.0.1:8000/api/qr/${matricule}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch QR Code');
          }
          setQrCodeUrl(url);
        } catch (err) {
          setError('Failed to load QR Code.');
          console.error('Error fetching QR Code:', err);
        }
      }
    };

    fetchQRCode();
  }, [matricule]); // Mettre à jour le QR code lorsque le matricule change

  return (
    <div>
      <h1>QR Code de lÉtudiant</h1>
      {error ? (
        <p>{error}</p>
      ) : qrCodeUrl ? (
        <Image
          src={qrCodeUrl}
          alt="QR Code"
          width={200} // Remplacer par la largeur souhaitée
          height={200} // Remplacer par la hauteur souhaitée
        />
      ) : (
        <p>Chargement du QR Code...</p>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  return await getUserWithRoles(context, ['Apprenant']); // Spécifie ici les rôles requis
}
export default EtudiantPage;

'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import QrReader from 'react-web-qr-reader';
import Swal from 'sweetalert2';
import {Box, Center, Text} from '@chakra-ui/react';
import NavbarVigile from '../../../components/layout/vigile/Navbar';

const QRCodeScanner = () => {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/connexion');
    }
  }, [router]);

  const delay = 500;
  const previewStyle = {
    height: 240,
    width: 320,
  };

  useEffect(() => {
    if (isScanned) {
      Swal.fire({
        title: 'Information Scannée',
        text: result || 'Aucune donnée scannée',
        icon: 'info',
        // showCancelButton: true,
        confirmButtonText: 'Valider le scan',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleValidation();
        } else {
          setIsScanned(false);
        }
      });
    }
  }, [isScanned, result]);

  const handleScan = (data) => {
    if (data?.text) {
      const scannedResult = data.text.trim();
      console.log('Scanned QR Code:', scannedResult); // Vérifie le matricule scanné
      setResult(scannedResult);
      setIsScanned(true);
    } else if (data?.binaryData) {
      const qrCodeText = binaryDataToText(data.binaryData).trim();
      console.log('Scanned QR Code from binary data:', qrCodeText); // Vérifie le matricule scanné
      setResult(qrCodeText);
      setIsScanned(true);
    }
  };

  const handleError = (error) => {
    console.error('QR Code Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors du scan.',
    });
  };

  const binaryDataToText = (binaryData) => {
    try {
      const bytes = new Uint8Array(binaryData);
      const text = new TextDecoder().decode(bytes);
      return text;
    } catch (error) {
      console.error('Conversion Error:', error);
      return 'Erreur lors de la conversion des données binaires';
    }
  };

  const handleValidation = async () => {
    try {
      if (!result) {
        throw new Error('Aucun matricule scanné.');
      }

      // Extraire uniquement le matricule
      const matricule = result.split('\n')[1].split(':')[1].trim();
      console.log('Matricule envoyé pour validation:', matricule);
      const token = localStorage.getItem('token'); // Utiliser localStorage ou sessionStorage

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pointage/depart`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ matricule }),
        }
      );

      const data = await response.json();

      console.log('Réponse du serveur:', data);

      if (!response.ok) {
        const errorMessage = data.errors
          ? Object.values(data.errors).flat().join(', ')
          : data.message || 'Erreur lors de la mise à jour du statut';
        throw new Error(errorMessage);
      }

      // Obtenir l'heure actuelle
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      Swal.fire({
        icon: 'success',
        title: 'Statut mis à jour',
        text: `Pointage validé à ${formattedTime}. ${data.message}`, // Afficher l'heure et le message du serveur
      });
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text:
          error.message ||
          'Une erreur est survenue lors de la mise à jour du statut.',
      });
    }
  };

  return (
    <>
      
      <Center display={'block'} bg="black" opacity="0.9"  h="93vh" mt="0">
        {/* QR Code Reader Section */}
        <Center mt="12">
          <Text color="white">Heure de depart</Text>
        </Center>
        <Center mt="10">
          <Box   zIndex={43}>
            <QrReader 
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            />
            {/* <p className="mt-4">{result ? result : 'Pas encore scanné'}</p> */}
          </Box >
        </Center>

        {/* Profile Card fixed at the bottom */}
        <NavbarVigile />
      </Center>
    </>
  );
};

export default QRCodeScanner;

'use client';
import { useEffect, useState } from 'react';
import QrReader from 'react-web-qr-reader';
import Swal from 'sweetalert2';
import NavbarVigile from '../../../components/layout/vigile/Navbar';
import { Box, Center, Text } from '@chakra-ui/react';
import { useUserWithRoles } from '../../../lib/utils/hooks/useUserWithRoles';

const QRCodeScanner = () => {
  const [result, setResult] = useState(null);
  const [isScanned, setIsScanned] = useState(false);
  useUserWithRoles(['Vigile']);

  const delay = 500;
  const previewStyle = {
    height: 240,
    width: 320,
  };

  // Add an audio element to play notification sound
  const playSuccessSound = () => {
    const audio = new Audio('/success-sound.mp3');
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture du fichier audio:', error);
    });
  };

  useEffect(() => {
    if (isScanned) {
      // Play success sound
      playSuccessSound();

      Swal.fire({
        title: 'Information Scannée',
        text: result || 'Aucune donnée scannée',
        icon: 'info',
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
      console.log('Scanned QR Code:', scannedResult);
      setResult(scannedResult);
      setIsScanned(true);
    } else if (data?.binaryData) {
      const qrCodeText = binaryDataToText(data.binaryData).trim();
      console.log('Scanned QR Code from binary data:', qrCodeText);
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

      const matricule = result.split('\n')[1].split(':')[1].trim();
      console.log('Matricule envoyé pour validation:', matricule);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pointage/arrivee`,
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

      const now = new Date();
      const formattedTime = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      Swal.fire({
        icon: 'success',
        title: 'Statut mis à jour',
        text: `Pointage validé à ${formattedTime}. ${data.message}`,
      });
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Une erreur est survenue lors de la mise à jour du statut.',
      });
    }
  };

  return (
    <>
      <Center display={'block'} bg="black" opacity="0.9" h="100vh" mt="0">
        <Center mt="12">
          <Text color="white">{`Heure d'arrivée`}</Text>
        </Center>
        <Center mt="10">
          <Box zIndex={43}>
            <QrReader 
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            />
          </Box>
        </Center>
        <NavbarVigile />
      </Center>
    </>
  );
};

export default QRCodeScanner;

'use client';

import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import QrReader from 'react-web-qr-reader';
import Swal from 'sweetalert2';
import NavbarVigile from '../../../components/layout/vigile/Navbar';
import { Box, Center, Text } from '@chakra-ui/react';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const QRCodeScanner = () => {
  const router = useRouter();
  const [result, setResult] = useState<string | null>(null);
  const [isScanned, setIsScanned] = useState(false);

  // Using SWR to get the API URL from environment variables
  const { data: apiUrl, error: apiError } = useSWR(
    '/api/config', // Hypothetical API to get config
    fetcher,
    {
      fallbackData: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    }
  );

  // Ensure the user is authenticated before proceeding
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

  // Handle the scanned result in a SweetAlert modal
  useEffect(() => {
    if (isScanned && result) {
      Swal.fire({
        title: 'Information Scannée',
        text: result || 'Aucune donnée scannée',
        icon: 'info',
        confirmButtonText: 'Valider le scan',
      }).then(async (scanResult) => {
        if (scanResult.isConfirmed) {
          await handleValidation();
        } else {
          setIsScanned(false); // Reset if the user cancels
        }
      });
    }
  }, [isScanned, result]);

  // Handle the scan event from the QR reader
  const handleScan = (data: any) => {
    if (data?.text) {
      const scannedResult = data.text.trim();
      setResult(scannedResult);
      setIsScanned(true);
    } else if (data?.binaryData) {
      const qrCodeText = binaryDataToText(data.binaryData).trim();
      setResult(qrCodeText);
      setIsScanned(true);
    }
  };

  const handleError = (error: any) => {
    console.error('QR Code Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors du scan.',
    });
  };

  const binaryDataToText = (binaryData: ArrayBuffer) => {
    try {
      const bytes = new Uint8Array(binaryData);
      const text = new TextDecoder().decode(bytes);
      return text;
    } catch (error) {
      console.error('Conversion Error:', error);
      return 'Erreur lors de la conversion des données binaires';
    }
  };

  // Handle the scanned data validation
  const handleValidation = async () => {
    try {
      if (!result) {
        throw new Error('Aucun matricule scanné.');
      }

      // Extract the matricule from the result (second line, after ":")
      const matricule = result.split('\n')[1].split(':')[1].trim();
      console.log('Matricule envoyé pour validation:', matricule);

      // Send the matricule to the API for validation
      const response = await fetch(`${apiUrl}/pointage/arrivee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricule }),
      });

      const data = await response.json();

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
    } catch (error: any) {
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
        {/* QR Code Reader Section */}
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
        {/* Profile Card fixed at the bottom */}
        <NavbarVigile />
      </Center>
    </>
  );
};

export default QRCodeScanner;

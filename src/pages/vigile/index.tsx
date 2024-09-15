'use client';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import QrReader from 'react-web-qr-reader';
import Swal from 'sweetalert2';

const QRCodeScanner = () => {
  const router = useRouter();
  const [result, setResult] = useState<string | null>(null);
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
        showCancelButton: true,
        confirmButtonText: 'Valider le scan',
        cancelButtonText: 'Annuler',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleValidation();
        } else {
          setIsScanned(false);
        }
      });
    }
  }, [isScanned, result]);

  const handleScan = (data: { text?: string; binaryData?: number[] }) => {
    if (data?.text) {
      const scannedResult = data.text.trim();
      console.log("Scanned QR Code:", scannedResult); // Vérifie le matricule scanné
      setResult(scannedResult);
      setIsScanned(true);
    } else if (data?.binaryData) {
      const qrCodeText = binaryDataToText(data.binaryData).trim();
      console.log("Scanned QR Code from binary data:", qrCodeText); // Vérifie le matricule scanné
      setResult(qrCodeText);
      setIsScanned(true);
    }
  };

  const handleError = (error: any) => {
    console.error("QR Code Error:", error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors du scan.',
    });
  };

  const binaryDataToText = (binaryData: number[]): string => {
    try {
      const bytes = new Uint8Array(binaryData);
      const text = new TextDecoder().decode(bytes);
      return text;
    } catch (error) {
      console.error("Conversion Error:", error);
      return "Erreur lors de la conversion des données binaires";
    }
  };

  const handleValidation = async () => {
    try {
      if (!result) {
        throw new Error("Aucun matricule scanné.");
      }
  
      // Extraire uniquement le matricule
      const matricule = result.split('\n')[1].split(':')[1].trim();
      console.log("Matricule envoyé pour validation:", matricule);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pointage/arrivee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricule }),
      });
  
      const data = await response.json();
  
      console.log("Réponse du serveur:", data);
  
      if (!response.ok) {
        const errorMessage = data.errors
          ? Object.values(data.errors).flat().join(', ')
          : data.message || "Erreur lors de la mise à jour du statut";
        throw new Error(errorMessage);
      }
  
      // Obtenir l'heure actuelle
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
      Swal.fire({
        icon: 'success',
        title: 'Statut mis à jour',
        text: `Pointage validé à ${formattedTime}. ${data.message}`, // Afficher l'heure et le message du serveur
      });
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || "Une erreur est survenue lors de la mise à jour du statut.",
      });
    }
  };
  
  return (
    <div>
      <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      <p className="mt-4">{result ? result : "Pas encore scanné"}</p>
    </div>
  );
};

export default QRCodeScanner;

import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast
} from '@chakra-ui/react';

function JustificationModal({ isOpen, onClose, pointageId }) {
  const [description, setDescription] = useState('');
  const [document, setDocument] = useState(null);
  const [existingJustification, setExistingJustification] = useState(null);
  const toast = useToast();

  const fetchJustification = async () => {
    try {
        const response = await fetch(`http://localhost:8000/api/justifier-absence/${pointageId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data); // Log the response data

        if (data.justification) {
            setExistingJustification(data.justification);
        }
    } catch (error) {
        console.error("Error fetching justification:", error);
    }
};

// Call this function when the modal opens
useEffect(() => {
    if (isOpen) {
        fetchJustification();
    }
}, [isOpen]);



  // Function to handle form submission
  const handleSubmit = async () => {
    if (!document) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger un document justificatif.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('document', document);

    try {
      const response = await fetch(`http://localhost:8000/api/justifier-absence/${pointageId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Succès",
          description: "Justificatif soumis avec succès.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose(); // Close the modal after success
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Une erreur est survenue.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Justifier l'absence</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
  {existingJustification ? (
    <>
      <p>Justificatif déjà soumis :</p>
      <p>Description : {existingJustification.description}</p>
      {existingJustification.document ? (
    <a
        href={existingJustification.document}
        target="_blank"
        rel="noopener noreferrer"
    >
        Voir le document justificatif
    </a>
) : (
    <p>Aucun document justificatif soumis.</p>
)}

      <p>Vous pouvez remplacer le justificatif ci-dessus.</p>
    </>
  ) : (
    <>
      <FormControl id="description" mt={4}>
        <FormLabel>Description (optionnelle)</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Entrez la raison de l'absence"
        />
      </FormControl>
      <FormControl id="document" mt={4}>
        <FormLabel>Document justificatif</FormLabel>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setDocument(e.target.files[0])}
        />
      </FormControl>
      <Button mt={4} colorScheme="blue" onClick={handleSubmit}>
        Soumettre
      </Button>
    </>
  )}
</ModalBody>


      </ModalContent>
    </Modal>
  );
}

export default JustificationModal;

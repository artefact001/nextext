import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from "@chakra-ui/react";

const PointageTable = ({ promoId=1, startDate, endDate }) => {
  const [pointages, setPointages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPointages = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/promo/${promoId}/pointages-semaine`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des pointages");
        }

        const data = await response.json();
        setPointages(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        setLoading(false);
      }
    };

    fetchPointages();
  }, [promoId, startDate, endDate]);

  if (loading) {
    return <Text>Chargement...</Text>;
  }
console.log(pointages)
  return (
    <Box>
      {pointages.start_of_week && pointages.end_of_week ? (
        <Text>Pointage de la semaine du {pointages.start_of_week} au {pointages.end_of_week}</Text>
      ) : (
        <Text>Dates de la semaine indisponibles.</Text>
      )}

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Jour</Th>
            <Th>Présences</Th>
            <Th>Retards</Th>
            <Th>Absences</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pointages.presences && Object.keys(pointages.presences).map((jour, index) => (
            <Tr key={index}>
              <Td>{jour}</Td>
              <Td>{pointages.presences[jour]?.length || 0}</Td>
              <Td>{pointages.retards[jour]?.length || 0}</Td>
              <Td>{pointages.absences[jour]?.length || 0}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PointageTable;

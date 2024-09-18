import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Icon,
  VStack,
  HStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Center,
  Select,
} from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import ListePointage from '../../components/func/apprenant/ListePointage';
import ProfileCard from '../../components/layout/apprenant/Navbar';

// Activer les plugins dayjs
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

const MesPointages = () => {
  const [pointages, setPointages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mois, setMois] = useState(dayjs().format('MM')); // Mois en cours
  const [annee, setAnnee] = useState(dayjs().format('YYYY')); // Année en cours
  const [selectedWeek, setSelectedWeek] = useState(dayjs().isoWeek());

  // Fonction pour obtenir les semaines d'un mois
  const getWeeksOfMonth = (mois, annee) => {
    const startOfMonth = dayjs(`${annee}-${mois}-01`);
    const endOfMonth = startOfMonth.endOf('month');
    const weeks = [];
    let currentWeek = startOfMonth.startOf('week');

    while (currentWeek.isBefore(endOfMonth, 'week')) {
      weeks.push({
        start: currentWeek.format('YYYY-MM-DD'),
        end: currentWeek.endOf('week').format('YYYY-MM-DD'),
        number: currentWeek.isoWeek(),
      });
      currentWeek = currentWeek.add(1, 'week');
    }

    return weeks;
  };

  const fetchPointagesParSemaine = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pointages/moi/apprenant?mois=${mois}&annee=${annee}&semaine=${selectedWeek}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erreur lors de la récupération des pointages.');
        return;
      }

      setPointages(data.pointages);
    } catch (err) {
      setError('Erreur lors de la récupération des pointages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPointagesParSemaine();
  }, [selectedWeek, mois, annee]);

  // Fonction pour gérer la pagination du mois précédent
  const handlePreviousMonth = () => {
    const previousMonth = dayjs(`${annee}-${mois}-01`).subtract(1, 'month');
    setMois(previousMonth.format('MM'));
    setAnnee(previousMonth.format('YYYY'));
    setSelectedWeek(previousMonth.isoWeek());
  };

  // Fonction pour gérer la pagination du mois suivant
  const handleNextMonth = () => {
    const nextMonth = dayjs(`${annee}-${mois}-01`).add(1, 'month');
    setMois(nextMonth.format('MM'));
    setAnnee(nextMonth.format('YYYY'));
    setSelectedWeek(nextMonth.isoWeek());
  };

  const handleMoisChange = (event) => {
    setMois(event.target.value);
    setSelectedWeek(dayjs(`${annee}-${event.target.value}-01`).isoWeek());
  };

  const handleAnneeChange = (event) => {
    setAnnee(event.target.value);
    setSelectedWeek(dayjs(`${event.target.value}-${mois}-01`).isoWeek());
  };

  const handleSemaineChange = (event) => {
    setSelectedWeek(parseInt(event.target.value, 10));
  };

  if (loading) {
    return (
      <Center flexDirection="column" h="100vh">
        <Spinner size="xl" />
        <Text fontSize="lg" mt={4}>Chargement des pointages...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center flexDirection="column" h="100vh">
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Center>
    );
  }

  const semainesDuMois = getWeeksOfMonth(mois, annee);

  return (
    <VStack spacing={1}  align="center" maxW="800px" mx="auto">
      <ProfileCard></ProfileCard>

      <Box
      as="section"
      display="flex"
      flexDirection="column"
      px={2}
      py={1}
      mt={4}
      mx="auto"
      w="full"
      maxW={{ base: '366px', md: '700px', lg: '900px' }}  // Responsive width for mobile, tablet, and desktop
      borderBottom="2px solid"
      borderTop="2px solid"
      borderColor="red.700"
      borderRadius="md"
      shadow="lg"
      bg="whiteAlpha.80"
      fontFamily="Nunito Sans"
    >
      {/* Header */}
      <Box textAlign="center">
        {/* Month Pagination */}
        <HStack spacing={4} justify="center"  my={3}>
          <Button onClick={handlePreviousMonth}  color="black"  shadow="lg" bg={'#ce0033'}>{'<'}</Button>
          <Text px={14} fontSize="lg" fontWeight="bold" color="black">
            {dayjs(`${annee}-${mois}-01`).format('MMMM YYYY')}
          </Text>
          <Button onClick={handleNextMonth} color="black" shadow="lg" bg={'#ce0033'}>{'>'}</Button>
        </HStack>
      </Box>

      {/* Week Selector */}
      <HStack justify="center">
        {semainesDuMois.map((week) => (


          <Button
            my={2}

            display="block"
            alignItems="center"
            key={week.number}
            onClick={() => setSelectedWeek(week.number)}
            bg={selectedWeek === week.number ? '#CE0033' : '#514E4E'}
            color={selectedWeek === week.number ? 'white' : 'gray.300'}
          >
          <Icon size="xl" as={FaCalendarAlt} />
          <Text  ml="-3" >Semaine</Text>

            {/* <Text>Semaine {week.number}</Text> */}
          </Button>

        ))}
      </HStack>   
      {/* Liste des pointages */}
      <ListePointage pointages={pointages} />
      </Box>
    </VStack>
  );
};

export default MesPointages;

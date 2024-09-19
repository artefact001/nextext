import React, { useState, useEffect } from 'react';
import { VStack, Spinner, Center, Box, Text, HStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import ProfileCard from '../../components/layout/formateur/Navbar';
import ListePointage from '../../components/func/formateur/ListePointage';
import MonthPagination from '../../components/common/MonthPagination';
import WeekSelector from '../../components/common/WeekSelector';
import AttendanceSummary from '../../components/common/AttendanceSummary';
import ProfileComponent from '../../components/func/formateur/profile';

// Activer les plugins dayjs
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

const MesPointages = () => {
  const [pointages, setPointages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mois, setMois] = useState(dayjs().format('MM'));
  const [annee, setAnnee] = useState(dayjs().format('YYYY'));
  const [selectedWeek, setSelectedWeek] = useState(dayjs().isoWeek());
  const [attendanceSummary, setAttendanceSummary] = useState({
    absent: 0,
    retard: 0,
  });

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
    setError(null); // Réinitialiser l'erreur avant la nouvelle requête
    setPointages([]); // Réinitialiser les pointages avant la nouvelle requête
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pointages/moi/apprenant?mois=${mois}&annee=${annee}&semaine=${selectedWeek}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Erreur lors de la récupération des pointages.');
        return;
      }
  
      // Si aucune donnée de pointage n'est trouvée
      if (!data.pointages || data.pointages.length === 0) {
        setError('Aucun pointage trouvé pour cette semaine.');
        setPointages([]); // S'assurer que pointages est vide
      } else {
        setPointages(data.pointages);
      }
  
      // Récupérer les statistiques de présence
      const responsestat = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pointages/moi/apprenant?mois=${mois}&annee=${annee}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const datastat = await responsestat.json();
  
      const absents = datastat.pointages.filter((p) => p.type === 'absence').length;
      const retards = datastat.pointages.filter((p) => p.type === 'retard').length;
  
      setAttendanceSummary({
        absent: absents,
        retard: retards,
      });
  
    } catch (err) {
      setError('Erreur lors de la récupération des pointages.');
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchPointagesParSemaine();
  }, [selectedWeek, mois, annee]);
  
  // useEffect(() => {
  //   if (error) {
  //     Swal.fire({
  //       title: 'Erreur',
  //       text: error,
  //       icon: 'error',
  //       confirmButtonText: 'OK',
  //     });
  //   }
  // }, [error]);

  const handlePreviousMonth = () => {
    const previousMonth = dayjs(`${annee}-${mois}-01`).subtract(1, 'month');
    setMois(previousMonth.format('MM'));
    setAnnee(previousMonth.format('YYYY'));
    setSelectedWeek(previousMonth.isoWeek());
  };

  const handleNextMonth = () => {
    const nextMonth = dayjs(`${annee}-${mois}-01`).add(1, 'month');
    setMois(nextMonth.format('MM'));
    setAnnee(nextMonth.format('YYYY'));
    setSelectedWeek(nextMonth.isoWeek());
  };
  // useEffect(() => {
  //   if (error) {
  //     Swal.fire({
  //       title: 'Erreur',
  //       text: error,
  //       icon: 'error',
  //       confirmButtonText: 'OK',

  //     });

  //   }
  // }, [error]);
  const semainesDuMois = getWeeksOfMonth(mois, annee);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <VStack spacing={4} maxW="100%">
      <ProfileCard />
      <HStack justifyContent="space-between"  w="100%">
        {/* ProfileComponent displayed only on desktop */}
        <Box display={{ base: 'none', md: 'block' }} flex="1" maxW="50%">
          <Box
           as="section"
           flexDirection="column"
           px={20}
           py={8}
           mt={7}
           mx={36}
           w="full"
           maxW={{ base: '366px', md: '500px', lg: '75%' }}
           display={{ base: 'none', md: 'block' }}
           borderBottom="2px solid"
           borderTop="2px solid"
           borderColor="red.700"
           borderRadius="md"
           shadow="lg"
           bg="whiteAlpha.80"
           fontFamily="Nunito Sans"
           flex="2"
          >
          <ProfileComponent />
          </Box>
        </Box>
        
        {/* List section */}
        <Box
          as="section"
          display="flex"
          flexDirection="column"
          px={1}
          py={8}
          mt={1}
          mx="auto"
          w="full"
          maxW={{ base: '366px', md: '500px', lg: '35%' }}
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="red.700"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
          fontFamily="Nunito Sans"
          flex="2"
        >
          <MonthPagination
            mois={mois}
            annee={annee}
            handlePreviousMonth={handlePreviousMonth}
            handleNextMonth={handleNextMonth}
          />
          <WeekSelector
            semainesDuMois={semainesDuMois}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />
          {loading ? (
            <Center mt={4}>
              <Spinner size="xl" />
            </Center>
          ) : error ? (
            <>
              <Center mt={4}>
                <Text fontSize="lg" color="gray.600">
                  {error}
                </Text>
              </Center>
              <AttendanceSummary summary={attendanceSummary} />
            </>
          ) : pointages.length === 0 ? (
            <>
              <Center mt={4}>
                <Text fontSize="lg" color="gray.600">
                  Aucun pointage trouvé pour cette période.
                </Text>
              </Center>
              <AttendanceSummary summary={attendanceSummary} />
            </>
          ) : (
            <>
              <ListePointage pointages={pointages} />
              <AttendanceSummary summary={attendanceSummary} />
            </>
          )}
        </Box>
      </HStack>
    </VStack>
  );
  
  
};

export default MesPointages;

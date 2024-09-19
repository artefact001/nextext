import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { VStack, Spinner, Center, Box, Text, HStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import ProfileCard from '../../components/layout/apprenant/Navbar';
import ListePointage from '../../components/func/apprenant/ListePointage';
import MonthPagination from '../../components/common/MonthPagination';
import WeekSelector from '../../components/common/WeekSelector';
import AttendanceSummary from '../../components/common/AttendanceSummary';
import ProfileComponent from '../../components/func/apprenant/profile';

dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);

const MesPointages = () => {
  const [pointages, setPointages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mois, setMois] = useState(dayjs().format('MM'));
  const [annee, setAnnee] = useState(dayjs().format('YYYY'));
  const [selectedWeek, setSelectedWeek] = useState(dayjs().isoWeek());
  const [attendanceSummary, setAttendanceSummary] = useState({ absent: 0, retard: 0 });

  // Memoize the weeks of the month based on selected month and year
  const semainesDuMois = useMemo(() => getWeeksOfMonth(mois, annee), [mois, annee]);

  // Function to get all weeks in a month
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

  // Fetch pointages and attendance summary, wrapped in useCallback to avoid re-defining it on every render
  const fetchPointagesParSemaine = useCallback(async () => {
    setLoading(true);
    setError(null);

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
        throw new Error(data.message || 'Erreur lors de la récupération des pointages.');
      }

      if (data.pointages?.length === 0) {
        setError('Aucun pointage trouvé pour cette semaine.');
      } else {
        setPointages(data.pointages);
      }

      // Fetch attendance summary
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

      setAttendanceSummary({ absent: absents, retard: retards });
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des pointages.');
    } finally {
      setLoading(false);
    }
  }, [mois, annee, selectedWeek]);

  // Fetch data when month, year, or selected week changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPointagesParSemaine();
    }, 300); // Debounce the fetch request by 300ms
    return () => clearTimeout(timeoutId);
  }, [fetchPointagesParSemaine]);

  // Handle month navigation
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
      <HStack justifyContent="space-between" w="100%">
        {/* ProfileComponent displayed only on desktop */}
        <Box
          display={{ base: 'none', md: 'block' }}
          flex="1"
          maxW="50%"
          px={20}
          py={8}
          mt={8}
          mx={36}
          w="full"
          borderBottom="2px solid"
          borderTop="2px solid"
          borderColor="red.700"
          borderRadius="md"
          shadow="lg"
          bg="whiteAlpha.80"
        >
          <ProfileComponent />
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
          {error ? (
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

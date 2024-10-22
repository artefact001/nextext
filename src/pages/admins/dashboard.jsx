/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Center,
  Flex,
  SimpleGrid,
  Heading,
  Select,
  Spinner,
  Skeleton,
  Text,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api } from '../../lib/utils/api';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';
import ProfileCardAdministrateur from '../../components/layout/admin/Navbar';

const MotionBox = motion(Box);

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const AdminPage = () => {
  useUserWithRoles(['Administrateur']);
  const [promoId, setPromoId] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [dateDebut, setDateDebut] = useState('2024-02-10');
  const [dateFin, setDateFin] = useState('2024-10-10');
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api('promos', 'GET');
        setPromotions(response);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchPromotions();
  }, []);

  const fetchData = useCallback(async () => {
    if (!promoId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/promos/static`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promo_id: promoId, date_debut: dateDebut, date_fin: dateFin }),
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des statistiques');

      const result = await response.json();

      if (result.success) {
        const weeklyChartData = Object.entries(result.statistiques_semaine).map(
          ([week, stats]) => ({
            name: `Semaine ${week} (${stats.date_debut} - ${stats.date_fin})`,
            absences: stats.absences,
            retards: stats.retards,
          })
        );

        const monthlyChartData = Object.entries(result.statistiques_mois).map(
          ([month, stats]) => ({
            name: month,
            absences: stats.absences,
            retards: stats.retards,
          })
        );

        setWeeklyData(weeklyChartData);
        setMonthlyData(monthlyChartData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [promoId, dateDebut, dateFin]);

  useEffect(() => {
    const debouncedFetch = debounce(fetchData, 500);
    debouncedFetch();
    return () => clearTimeout(debouncedFetch);
  }, [fetchData]);

  if (error) {
    return (
      <Center>
        <Text color="red.500">{error}</Text>
        <Button onClick={() => setError(null)} mt={4}>Réessayer</Button>
      </Center>
    );
  }

  const totalAbsences = weeklyData.reduce((acc, item) => acc + item.absences, 0);
  const totalDelays = weeklyData.reduce((acc, item) => acc + item.retards, 0);
  const pieData = [
    { name: 'Absences', value: totalAbsences },
    { name: 'Retards', value: totalDelays },
  ];

  const COLORS = ['#ce0033', '#3182ce'];

  return (
    <Center display="block" py={8}>
      <ProfileCardAdministrateur />

      <SimpleGrid mx={{ base: '4px', md: '10px', lg: '20px' }} columns={[1, null, 3]} spacing={10}>
        <MotionBox
          as="section"
          p={{ base: 4, md: 8 }}
          pt={{ base: 4, md: 24 }}
          borderRadius="md"
          shadow="md"
          bg="whiteAlpha.90"
          whileHover={{ scale: 1.03 }}
        >
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Statistiques Hebdomadaires
          </Heading>

          {loading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : promoId ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="absences" fill="#ce0033" />
                <Bar dataKey="retards" fill="#3182ce" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Text textAlign="center">Veuillez sélectionner une promotion</Text>
          )}
        </MotionBox>

        <MotionBox
          as="section"
          p={{ base: 4, md: 8 }}
          borderRadius="md"
          shadow="md"
          bg="whiteAlpha.90"
          whileHover={{ scale: 1.03 }}
        >
          <Flex justifyContent="center" mb={6}>
            <Select
              placeholder="Sélectionnez une promotion"
              value={promoId}
              onChange={(e) => setPromoId(e.target.value)}
              width="60%"
            >
              {promotions.map((promo) => (
                <option key={promo.id} value={promo.id}>
                  {promo.nom}
                </option>
              ))}
            </Select>
          </Flex>

          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Statistiques Mensuelles
          </Heading>

          {loading ? (
            <Skeleton height="400px" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="absences" stroke="#ce0033" />
                <Line type="monotone" dataKey="retards" stroke="#3182ce" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </MotionBox>

        <MotionBox
          as="section"
          p={{ base: 4, md: 8 }}
          pt={{ base: 4, md: 24 }}
          borderRadius="md"
          shadow="md"
          bg="whiteAlpha.90"
          whileHover={{ scale: 1.03 }}
        >
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Détails des Statistiques
          </Heading>

          {loading ? (
            <Center>
              <Spinner size="xl" />
            </Center>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </MotionBox>
      </SimpleGrid>
    </Center>
  );
};

export default AdminPage;

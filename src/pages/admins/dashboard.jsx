import React, { useEffect, useState } from 'react';
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
} from 'recharts';
import { api } from '../../lib/utils/api';
import { useUserWithRoles } from '../../lib/utils/hooks/useUserWithRoles';
import ProfileCardAdministrateur from '../../components/layout/admin/Navbar';

const MotionBox = motion(Box);

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

  useEffect(() => {
    if (!promoId) return;
    const fetchData = async () => {
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
          const weeklyChartData = Object.entries(result.statistiques_semaine).map(([week, stats]) => ({
            name: `Semaine ${week} (${stats.date_debut} - ${stats.date_fin})`, // Ajout des dates dans le nom
            absences: stats.absences,
            retards: stats.retards,
          }));
  
          const monthlyChartData = Object.entries(result.statistiques_mois).map(([month, stats]) => ({
            name: month,
            absences: stats.absences,
            retards: stats.retards,
          }));
  
          setWeeklyData(weeklyChartData);
          setMonthlyData(monthlyChartData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [promoId, dateDebut, dateFin]);
  
  if (error) {
    return <Text color="red.500">Erreur : {error}</Text>;
  }

  return (
    <Center display="block" py={8}>
      <ProfileCardAdministrateur />

      <SimpleGrid
        mx={{ base: '4px', md: '10px', lg: '20px' }}
        columns={[1, null, 2]}
        spacing={10}
      >
        <MotionBox
          as="section"
          p={{ base: 4, md: 8 }}
          pt={{ base: 4, md: 24 }}

          borderRadius="md"
          shadow="md"
          bg="whiteAlpha.90"
          whileHover={{ scale: 1.03}}
          // whileTap={{ scale: 0.95 }}
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
          whileHover={{ scale: 1.03  }}
          // whileTap={{ scale: 1.95 }}
        >
          {/* <Heading as="h2" size="lg" mb={4} textAlign="center">
            Sélection de Promotion
          </Heading> */}

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
      </SimpleGrid>
    </Center>
  );
};

export default AdminPage;

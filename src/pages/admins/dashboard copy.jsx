import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { api } from '../../lib/utils/api';

export default function StatistiquesPromo() {
    const [promoId, setPromoId] = useState(null);
    const [promotions, setPromotions] = useState([]);
    const [dateDebut, setDateDebut] = useState('2024-02-10');
    const [dateFin, setDateFin] = useState('2024-10-10');
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les promotions depuis l'API
    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await api('promos', 'GET');
                setPromotions(response);
                console.log(response);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPromotions();
    }, []);

    // Charger les statistiques lorsque promoId, dateDebut, ou dateFin changent
    useEffect(() => {
        if (!promoId) return; // Ne pas exécuter si aucune promotion n'est sélectionnée

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
                        name: `Semaine ${week}`,
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
        return <p style={{ color: 'red' }}>Erreur : {error}</p>;
    }

    return (
        <>
            <h2>Statistiques de la Promotion</h2>
            {/* Sélectionner une promotion */}
            <div>
                <label htmlFor="promoSelect">Choisir une Promotion :</label>
                <select
                    id="promoSelect"
                    value={promoId}
                    onChange={(e) => setPromoId(e.target.value)}
                >
                    <option value="">Sélectionnez une promotion</option>
                    {promotions.map((promo) => (
                        <option key={promo.id} value={promo.id}>
                            {promo.nom}
                        </option>
                    ))}
                </select>
            </div>

            {promoId ? (
                <>
                    {/* Afficher les statistiques hebdomadaires */}
                    <h2>Statistiques Hebdomadaires</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="absences" fill="#8884d8" />
                            <Bar dataKey="retards" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Afficher les statistiques mensuelles */}
                    <h2>Statistiques Mensuelles</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="absences" stroke="#8884d8" />
                            <Line type="monotone" dataKey="retards" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            ) : (
                <p>Veuillez sélectionner une promotion pour voir les statistiques.</p>
            )}
        </>
    );
}

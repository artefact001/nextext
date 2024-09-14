import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '@utils/api';

const Dashboard = () => {
    const router = useRouter();
    const logout = async () => {
    
        try {
            // Appel à l'API Laravel pour invalider le token JWT
            await api('logout', 'POST');
    
            // Supprime le token du localStorage
            localStorage.removeItem('token');
    
            // Redirige vers la page de connexion après la déconnexion
            router.push('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        }
    };
    const handleLogout = async () => {
        await logout(); // Déclenche la déconnexion
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // Si le token n'est pas trouvé, rediriger vers la page de login
        if (!token) {
            router.push('/login');
        }
    }, []);

    return (
        <div>
            <h1>Tableau de Bord</h1>
            <p>Bienvenue sur la page protégée du tableau de bord.</p>
            <button onClick={handleLogout}>Déconnexion</button>

        </div>
    );
};

export default Dashboard;

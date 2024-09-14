import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Réinitialise les erreurs à chaque soumission

        try {
            // Appel API pour le login
            const response = await api('login', 'POST', { email, password });

            if (response.errors || response.message || response.error) {
                // En cas d'erreur, affiche le message provenant du backend
                setError(response.errors?.email?.[0] || response.message || response.error);
            } else if (response.access_token) {
                // Si l'authentification réussit, stocke le token dans le localStorage
                localStorage.setItem('token', response.access_token);
                
                // Redirection vers une page protégée (par exemple : tableau de bord)
                router.push('/dashboard'); // Remplace '/dashboard' par la route protégée de ton application
            } else {
                // Si une erreur inattendue survient
                setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
            }
        } catch (err) {
            console.error('Erreur lors de la requête', err);
            setError('Erreur lors de la connexion. Veuillez vérifier vos informations et réessayer.');
        }
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default Login;

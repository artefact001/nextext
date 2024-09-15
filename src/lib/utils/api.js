    // src/lib/utils/api.js
    export const api = async (endpoint, method = 'GET', data = null) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ajoute le token JWT
            },
            body: data ? JSON.stringify(data) : null,
        });

        return await res.json();
    };

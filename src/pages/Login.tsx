import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';

export function Login() {
    const { login, register } = useUser();
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Username is required');
            return;
        }

        const success = isRegistering
            ? await register(name.trim(), password)
            : await login(name.trim(), password);

        if (!success) {
            setError(isRegistering ? 'Username already taken' : 'Invalid username or password');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <span style={{ fontSize: '4rem' }}>🌮</span>
                <h1 className="heading" style={{ fontSize: '2rem', marginTop: '1rem' }}>Taco Tracker</h1>
                <p className="text-secondary">Track your tacos, analyze your stats.</p>
            </div>

            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="heading" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(231, 29, 54, 0.1)',
                        color: 'var(--accent-danger)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                        <input
                            type="text"
                            className="input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>Password {isRegistering ? '(Optional)' : ''}</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        {isRegistering ? (
                            <><UserPlus size={18} /> Create Account</>
                        ) : (
                            <><LogIn size={18} /> Login</>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span className="text-secondary">
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    </span>
                    {' '}
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                            setName('');
                            setPassword('');
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-primary)',
                            fontWeight: '600',
                            padding: 0,
                            textDecoration: 'underline'
                        }}
                    >
                        {isRegistering ? 'Login' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
}

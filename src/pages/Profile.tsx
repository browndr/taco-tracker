import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

export function Profile() {
    const { currentUser, updatePassword } = useUser();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [statusMsg, setStatusMsg] = useState('');

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('idle');

        if (newPassword !== confirmPassword) {
            setStatus('error');
            setStatusMsg('Passwords do not match');
            return;
        }

        if (!newPassword.trim()) {
            setStatus('error');
            setStatusMsg('Password cannot be empty');
            return;
        }

        const success = await updatePassword(newPassword);
        if (success) {
            setStatus('success');
            setStatusMsg('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setStatus('error');
            setStatusMsg('Failed to update password');
        }
    };

    return (
        <div className="container">
            <h1 className="heading">User Profile</h1>

            <div className="card">
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <KeyRound size={20} className="text-secondary" />
                    Update Password
                </h2>

                {currentUser?.password ? (
                    <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Your account is currently protected by a password. Enter a new one below to change it.
                    </p>
                ) : (
                    <div style={{
                        backgroundColor: 'rgba(255, 159, 28, 0.1)',
                        color: 'var(--accent-primary)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem'
                    }}>
                        Your account does not have a password set. Set one now to secure your account.
                    </div>
                )}

                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                    <div>
                        <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                        <input
                            type="password"
                            className="input"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
                        <input
                            type="password"
                            className="input"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {status === 'success' && (
                        <div style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={16} /> {statusMsg}
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={16} /> {statusMsg}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                        Set Password
                    </button>
                </form>
            </div>
        </div>
    );
}

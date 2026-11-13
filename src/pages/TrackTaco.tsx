import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { useUser } from '../context/UserContext';
import { Plus, Star } from 'lucide-react';

export function TrackTaco() {
    const { currentUser } = useUser();
    const navigate = useNavigate();
    const toppings = useLiveQuery(() => db.toppings.toArray()) || [];

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
    const [notes, setNotes] = useState('');
    const [rating, setRating] = useState(5);
    const [newToppingName, setNewToppingName] = useState('');
    const [isAddingTopping, setIsAddingTopping] = useState(false);

    const handleToggleTopping = (id: number) => {
        setSelectedToppings(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleAddTopping = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newToppingName.trim()) {
            try {
                const id = await db.toppings.add({ name: newToppingName.trim() });
                setSelectedToppings(prev => [...prev, id]);
                setNewToppingName('');
                setIsAddingTopping(false);
            } catch (error) {
                alert('Topping already exists!');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        await db.tacos.add({
            userId: currentUser.id,
            date: new Date(date).toISOString(),
            toppingIds: selectedToppings,
            notes,
            rating
        });

        navigate('/history');
    };

    return (
        <div className="container">
            <h1 className="heading">Track a Taco 🌮</h1>
            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Date */}
                <div>
                    <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>Date</label>
                    <input
                        type="date"
                        className="input"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                </div>

                {/* Toppings */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="text-secondary">Toppings</label>
                        {!isAddingTopping && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                onClick={() => setIsAddingTopping(true)}
                            >
                                <Plus size={14} /> New
                            </button>
                        )}
                    </div>

                    {isAddingTopping && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Topping name..."
                                value={newToppingName}
                                onChange={e => setNewToppingName(e.target.value)}
                                autoFocus
                            />
                            <button type="button" className="btn btn-primary" onClick={handleAddTopping}>Add</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsAddingTopping(false)}>Cancel</button>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {toppings.map(topping => (
                            <label
                                key={topping.id}
                                style={{
                                    cursor: 'pointer',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    backgroundColor: selectedToppings.includes(topping.id) ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                    color: selectedToppings.includes(topping.id) ? '#000' : 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    transition: 'all 0.2s',
                                    userSelect: 'none'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    style={{ display: 'none' }}
                                    checked={selectedToppings.includes(topping.id)}
                                    onChange={() => handleToggleTopping(topping.id)}
                                />
                                {topping.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div>
                    <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>Rating</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    color: star <= rating ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                }}
                            >
                                <Star fill={star <= rating ? 'currentColor' : 'none'} size={32} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="text-secondary" style={{ display: 'block', marginBottom: '0.5rem' }}>Notes</label>
                    <textarea
                        className="input"
                        rows={3}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Was it delicious?"
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Track Taco
                </button>
            </form>
        </div>
    );
}

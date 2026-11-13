import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useUser } from '../context/UserContext';
import { Star } from 'lucide-react';

export function History() {
    const { currentUser } = useUser();

    const toppings = useLiveQuery(() => db.toppings.toArray()) || [];
    const toppingMap = new Map(toppings.map(t => [t.id, t.name]));

    const tacos = useLiveQuery(async () => {
        if (!currentUser) return [];
        return await db.tacos
            .where('userId')
            .equals(currentUser.id)
            .reverse()
            .sortBy('date');
    }, [currentUser?.id]);

    if (!tacos || tacos.length === 0) {
        return (
            <div className="container">
                <h1 className="heading">Taco History</h1>
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p className="text-secondary">No tacos logged yet. Get eating! 🌮</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="heading">Taco History</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tacos.map(taco => (
                    <div key={taco.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {new Date(taco.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < (taco.rating || 0) ? 'var(--accent-primary)' : 'none'}
                                        color={i < (taco.rating || 0) ? 'var(--accent-primary)' : 'var(--text-secondary)'}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {taco.toppingIds.map(tid => (
                                <span
                                    key={tid}
                                    style={{
                                        fontSize: '0.8rem',
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        borderRadius: '12px',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    {toppingMap.get(tid) || 'Unknown'}
                                </span>
                            ))}
                        </div>

                        {taco.notes && (
                            <p style={{ margin: '0.5rem 0 0', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                "{taco.notes}"
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

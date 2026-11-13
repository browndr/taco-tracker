import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useUser } from '../context/UserContext';
import { Calendar, Star, TrendingUp } from 'lucide-react';

export function Dashboard() {
    const { currentUser } = useUser();
    const toppings = useLiveQuery(() => db.toppings.toArray()) || [];
    const toppingMap = new Map(toppings.map(t => [t.id, t.name]));

    const stats = useLiveQuery(async () => {
        if (!currentUser) return null;

        const allTacos = await db.tacos.where('userId').equals(currentUser.id).toArray();
        const currentYear = new Date().getFullYear();
        const tacosThisYear = allTacos.filter(t => new Date(t.date).getFullYear() === currentYear);

        // Calculate topping frequency
        const toppingCounts: Record<number, number> = {};
        tacosThisYear.forEach(t => {
            t.toppingIds.forEach(tid => {
                toppingCounts[tid] = (toppingCounts[tid] || 0) + 1;
            });
        });

        const sortedToppings = Object.entries(toppingCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([id, count]) => ({
                name: toppingMap.get(Number(id)) || 'Unknown',
                count
            }));

        const avgRating = tacosThisYear.length > 0
            ? tacosThisYear.reduce((acc, t) => acc + (t.rating || 0), 0) / tacosThisYear.length
            : 0;

        return {
            totalThisYear: tacosThisYear.length,
            topToppings: sortedToppings,
            avgRating: avgRating.toFixed(1)
        };
    }, [currentUser?.id, toppings]);

    if (!currentUser) return null;

    return (
        <div className="container">
            <h1 className="heading">Dashboard</h1>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Welcome back, <span className="text-accent">{currentUser.name}</span>! Here's your taco stats for {new Date().getFullYear()}.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 159, 28, 0.1)', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                        <Calendar size={32} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalThisYear || 0}</div>
                        <div className="text-secondary">Tacos Eaten</div>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(46, 196, 182, 0.1)', borderRadius: '50%', color: 'var(--accent-secondary)' }}>
                        <Star size={32} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.avgRating || '0.0'}</div>
                        <div className="text-secondary">Average Rating</div>
                    </div>
                </div>
            </div>

            <h2 className="heading" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} /> Top Toppings
            </h2>
            <div className="card">
                {stats?.topToppings && stats.topToppings.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.topToppings.map((t, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32',
                                    color: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {i + 1}
                                </div>
                                <div style={{ flex: 1 }}>{t.name}</div>
                                <div style={{ fontWeight: 'bold' }}>{t.count}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary">Log some tacos to see your favorites!</p>
                )}
            </div>
        </div>
    );
}

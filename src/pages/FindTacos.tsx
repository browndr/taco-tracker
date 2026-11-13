import { useState } from 'react';
import { Navigation, ExternalLink, Loader } from 'lucide-react';

interface Place {
    id: number;
    lat: number;
    lon: number;
    tags: {
        name?: string;
        'addr:street'?: string;
        cuisine?: string;
        opening_hours?: string;
    };
}

export function FindTacos() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);

    const findPlaces = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });

                try {
                    // Overpass API query for mexican cuisine or tacos within 5km
                    const query = `
            [out:json][timeout:25];
            (
              node["cuisine"="mexican"](around:5000,${latitude},${longitude});
              node["food"="tacos"](around:5000,${latitude},${longitude});
              way["cuisine"="mexican"](around:5000,${latitude},${longitude});
              way["food"="tacos"](around:5000,${latitude},${longitude});
            );
            out center;
          `;

                    const response = await fetch('https://overpass-api.de/api/interpreter', {
                        method: 'POST',
                        body: query
                    });

                    if (!response.ok) throw new Error('Failed to fetch data');

                    const data = await response.json();
                    setPlaces(data.elements);
                } catch (err) {
                    setError('Failed to find taco places. Please try again.');
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError('Unable to retrieve your location');
                setLoading(false);
            }
        );
    };

    const openInMaps = (lat: number, lon: number) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
    };

    return (
        <div className="container">
            <h1 className="heading">Find Tacos Nearby</h1>

            <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <p className="text-secondary" style={{ marginBottom: '1rem' }}>
                    Craving tacos? We'll look for Mexican restaurants and taco spots within 5km of your location.
                </p>

                <button
                    className="btn btn-primary"
                    onClick={findPlaces}
                    disabled={loading}
                    style={{ width: '100%', maxWidth: '300px' }}
                >
                    {loading ? (
                        <><Loader className="animate-spin" size={20} /> Searching...</>
                    ) : (
                        <><Navigation size={20} /> Find Tacos Near Me</>
                    )}
                </button>

                {error && (
                    <div style={{ marginTop: '1rem', color: 'var(--accent-danger)' }}>
                        {error}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {places.map(place => (
                    <div key={place.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                                    {place.tags.name || 'Unnamed Taco Spot'}
                                </h3>
                                {place.tags['addr:street'] && (
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {place.tags['addr:street']}
                                    </p>
                                )}
                                {place.tags.opening_hours && (
                                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                                        Open: {place.tags.opening_hours}
                                    </p>
                                )}
                            </div>
                            <button
                                className="btn btn-secondary"
                                style={{ padding: '0.5rem' }}
                                onClick={() => openInMaps(place.lat || (place as any).center.lat, place.lon || (place as any).center.lon)}
                                title="Open in Maps"
                            >
                                <ExternalLink size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                {places.length === 0 && !loading && !error && userLocation && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No taco places found nearby. Time to open your own stand! 🌮
                    </div>
                )}
            </div>
        </div>
    );
}

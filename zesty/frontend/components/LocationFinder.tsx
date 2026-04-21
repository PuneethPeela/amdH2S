import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNearbyLocations } from '@/lib/api';

export function LocationFinder() {
    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLocations = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const data = await getNearbyLocations(lat, lng);
                    if (data && data.places) {
                        setPlaces(data.places);
                    } else {
                        setError("No healthy places found nearby.");
                    }
                } catch (err: any) {
                    setError(err.message || "Failed to fetch locations. Check Maps API Key.");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError(`Location access denied. Please allow location permissions.`);
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        // Optionally auto-fetch on mount, but users need to grant permission.
        fetchLocations();
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-5 space-y-4"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <span aria-hidden="true">📍</span> Healthy Near You
                </h2>
                <button
                    onClick={fetchLocations}
                    disabled={loading}
                    className="text-xs text-orange-400 font-medium hover:text-orange-300 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Locating...' : 'Refresh'}
                </button>
            </div>

            <AnimatePresence mode="popLayout">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                    >
                        {error}
                    </motion.div>
                )}

                {loading && places.length === 0 && (
                    <motion.div className="space-y-3">
                        {[1, 2].map(i => (
                            <div key={i} className="h-16 rounded-xl skeleton" />
                        ))}
                    </motion.div>
                )}

                {!loading && places.length === 0 && !error && (
                    <p className="text-xs text-slate-400">Loading your location to find healthy spots...</p>
                )}

                {places.map((place, i) => (
                    <motion.div
                        key={place.name + i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-light p-3 flex justify-between items-start"
                    >
                        <div>
                            <p className="text-sm font-semibold text-white">{place.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{place.address}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                            {place.rating && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">{place.rating} ★</span>}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.section>
    );
}

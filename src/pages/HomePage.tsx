import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Venue {
  id: string;
  name: string;
  description: string;
  media: { url: string }[];
  price: number;
  rating: number;
  maxGuests: number;
}

export function HomePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(
          "https://v2.api.noroff.dev/holidaze/venues?_owner=true&_bookings=true"
        );
        const json = await response.json();
        setVenues(json.data);
      } catch (error) {
        console.error("Failed to fetch venues", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading venues...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6 md:grid-cols-3">
      {venues.map((venue) => (
        <Link
          key={venue.id}
          to={`/venue/${venue.id}`}
          className="bg-stone-900 rounded-xl overflow-hidden shadow hover:scale-105 transition"
        >
          <img
            src={venue.media?.[0]?.url || "https://placehold.co/600x400"}
            alt={venue.name}
            className="h-48 w-full object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold">{venue.name}</h2>
            <p className="text-stone-400 text-sm mt-2">
              {venue.description.slice(0, 80)}...
            </p>
            <div className="mt-3 flex justify-between text-sm">
              <span>⭐ {venue.rating}</span>
              <span className="text-amber-400 font-semibold">
                ${venue.price} / night
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

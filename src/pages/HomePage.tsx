import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFromApi } from "../utils/api";
import Spinner from "../components/Spinner";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  media?: { url: string; alt?: string }[];
}

export default function HomePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVenues() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchFromApi(
          "/holidaze/venues?_bookings=true&_limit=100"
        );

        setVenues(data.data);
      } catch (err) {
        console.error("Failed to load venues", err);
        setError("Failed to load venues. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, []);

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 py-12 px-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <h1 className="text-4xl font-serif text-white uppercase tracking-widest mb-10">
        The Collection
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search venues..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-10 px-4 py-3 bg-stone-900 border border-stone-800 text-white focus:outline-none focus:border-amber-600 transition"
      />

      {/* Empty State */}
      {filteredVenues.length === 0 && (
        <div className="text-center py-20">
          <p className="text-stone-500 text-lg">
            No venues found.
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredVenues.map((venue) => (
          <Link
            key={venue.id}
            to={`/venue/${venue.id}`}
            className="bg-stone-900 border border-stone-800 hover:border-amber-600 transition p-4 group"
          >
            {/* Image */}
            <img
              src={
                venue.media?.[0]?.url ||
                "https://placehold.co/600x400?text=No+Image"
              }
              alt={venue.media?.[0]?.alt || venue.name}
              className="h-56 w-full object-cover mb-4"
            />

            {/* Title */}
            <h2 className="text-xl font-serif text-white mb-2 group-hover:text-amber-500 transition">
              {venue.name}
            </h2>

            {/* Description */}
            <p className="text-stone-400 text-sm line-clamp-2 mb-4">
              {venue.description}
            </p>

            {/* Price */}
            <p className="text-amber-500 font-semibold">
              ${venue.price} / night
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
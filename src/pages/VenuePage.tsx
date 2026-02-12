import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookingForm } from "../components/BookingForm";

interface Venue {
  id: string;
  name: string;
  description: string;
  media: { url: string }[];
  price: number;
  rating: number;
  maxGuests: number;
  location: {
    address: string;
    city: string;
    country: string;
  };
}

export function VenuePage() {
  const { id } = useParams();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      try {
        setLoading(true);

        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true&_bookings=true`
        );

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.errors?.[0]?.message || "Failed to fetch venue");
        }

        setVenue(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchVenue();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center mt-20 text-stone-400">Loading venue...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  if (!venue) {
    return <p className="text-center mt-20">Venue not found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* IMAGE */}
      <img
        src={venue.media?.[0]?.url || "https://placehold.co/1200x500"}
        alt={venue.media?.[0]?.alt || venue.name}
        className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
      />

      {/* INFO */}
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-white">{venue.name}</h1>

        <p className="text-stone-400 mt-2">
          📍 {venue.location?.city}, {venue.location?.country}
        </p>

        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <span className="text-yellow-400">⭐ {venue.rating}</span>
          <span>👥 Max Guests: {venue.maxGuests}</span>
          <span className="text-amber-400 font-semibold text-lg">
            ${venue.price} / night
          </span>
        </div>

        <p className="mt-6 text-stone-300 leading-relaxed max-w-3xl">
          {venue.description}
        </p>
      </div>

      {/* BOOKING FORM */}
      <div className="mt-12 border-t border-stone-800 pt-8">
        <BookingForm venueId={venue.id} />
      </div>
    </div>
  );
}
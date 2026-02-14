import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFromApi } from "../utils/api";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = "2ae3e868-69f2-430f-b7cb-5f7d53949d57";

interface Booking {
  dateFrom: string;
  dateTo: string;
}

interface Venue {
  id: string;
  name: string;
  description: string;
  media?: { url: string; alt?: string }[];
  price: number;
  rating: number;
  maxGuests: number;
  bookings?: Booking[];
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
}

export default function VenuePage() {
  const { id } = useParams();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking state
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const data = await fetchFromApi(
          `/holidaze/venues/${id}?_owner=true&_bookings=true`
        );

        setVenue(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load venue");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchVenue();
  }, [id]);

  function isDateBooked(start: string, end: string) {
    if (!venue?.bookings) return false;

    const selectedStart = new Date(start);
    const selectedEnd = new Date(end);

    return venue.bookings.some((booking) => {
      const bookedStart = new Date(booking.dateFrom);
      const bookedEnd = new Date(booking.dateTo);

      return selectedStart <= bookedEnd && selectedEnd >= bookedStart;
    });
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();

    if (!dateFrom || !dateTo) {
      alert("Please select dates.");
      return;
    }

    if (isDateBooked(dateFrom, dateTo)) {
      alert("Selected dates are already booked.");
      return;
    }

    try {
      setBookingLoading(true);

      await fetchFromApi("/holidaze/bookings", {
        method: "POST",
        body: JSON.stringify({
          venueId: venue?.id,
          dateFrom,
          dateTo,
          guests,
        }),
      });

      alert("Booking successful!");
      setDateFrom("");
      setDateTo("");
    } catch (error) {
      alert("Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading)
    return <p className="text-center mt-20 text-stone-400">Loading...</p>;

  if (error)
    return <p className="text-center mt-20 text-red-500">{error}</p>;

  if (!venue)
    return <p className="text-center mt-20">Venue not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-stone-950 min-h-screen">

      {/* IMAGE */}
      <img
        src={venue.media?.[0]?.url || "https://placehold.co/1200x500"}
        alt={venue.media?.[0]?.alt || venue.name}
        className="w-full h-[400px] object-cover rounded-xl"
      />

      {/* INFO */}
      <div className="mt-8">
        <h1 className="text-4xl font-serif text-white">{venue.name}</h1>

        <p className="text-stone-400 mt-2">
          📍 {venue.location?.city}, {venue.location?.country}
        </p>

        <div className="mt-4 flex gap-6 text-sm">
          <span className="text-yellow-400">⭐ {venue.rating}</span>
          <span>👥 Max Guests: {venue.maxGuests}</span>
          <span className="text-amber-500 font-semibold text-lg">
            ${venue.price} / night
          </span>
        </div>

        <p className="mt-6 text-stone-300 max-w-3xl">
          {venue.description}
        </p>
      </div>

      {/* BOOKING FORM */}
      <div className="mt-12 border-t border-stone-800 pt-8">
        <h2 className="text-2xl font-serif text-white mb-6">
          Book This Venue
        </h2>

        <form onSubmit={handleBooking} className="space-y-6 max-w-md">

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-4 py-3 bg-stone-900 border border-stone-800 text-white"
            required
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-4 py-3 bg-stone-900 border border-stone-800 text-white"
            required
          />

          <input
            type="number"
            min="1"
            max={venue.maxGuests}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-4 py-3 bg-stone-900 border border-stone-800 text-white"
            required
          />

          <button
            type="submit"
            disabled={bookingLoading}
            className="w-full bg-amber-600 py-3 text-white uppercase text-xs tracking-widest hover:bg-amber-700 transition"
          >
            {bookingLoading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>

        {/* BOOKED DATES LIST */}
        {venue.bookings && venue.bookings.length > 0 && (
          <div className="mt-8">
            <h3 className="text-stone-400 text-sm uppercase tracking-widest mb-3">
              Already Booked Dates
            </h3>

            <ul className="text-stone-500 text-sm space-y-2">
              {venue.bookings.map((booking) => (
                <li key={booking.id}>
                  {new Date(booking.dateFrom).toLocaleDateString()} →
                  {" "}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
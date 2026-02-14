import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = "2ae3e868-69f2-430f-b7cb-5f7d53949d57";

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  venue: {
    id: string;
    name: string;
    media?: { url: string }[];
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const token = localStorage.getItem("holidaze_token");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      try {
        const response = await fetch(
          `${API_BASE}/holidaze/profiles/${user.name}/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.errors?.[0]?.message);
        }

        setBookings(data.data);
      } catch (error) {
        console.error("Failed to load bookings", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user]);

  async function handleCancelBooking(id: string) {
    if (!confirm("Cancel this booking?")) return;

    try {
      const response = await fetch(
        `${API_BASE}/holidaze/bookings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      // Remove from UI instantly
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      alert("Error cancelling booking");
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-950 py-12 px-6 max-w-6xl mx-auto">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-6 mb-12">
        <img
          src={user.avatar?.url || "https://placehold.co/100"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover border border-stone-700"
        />

        <div>
          <h1 className="text-3xl font-serif text-white">
            {user.name}
          </h1>
          <p className="text-stone-400">{user.email}</p>
        </div>
      </div>

      {/* BOOKINGS */}
      <h2 className="text-2xl font-serif text-white mb-6">
        Upcoming Bookings
      </h2>

      {loading && (
        <p className="text-stone-400">Loading bookings...</p>
      )}

      {!loading && bookings.length === 0 && (
        <p className="text-stone-500">
          You have no bookings yet.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-stone-900 border border-stone-800 p-6 rounded-xl"
          >
            <img
              src={
                booking.venue.media?.[0]?.url ||
                "https://placehold.co/600x300"
              }
              alt={booking.venue.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            <h3 className="text-white font-semibold mb-2">
              {booking.venue.name}
            </h3>

            <p className="text-stone-400 text-sm mb-4">
              {new Date(booking.dateFrom).toLocaleDateString()} –{" "}
              {new Date(booking.dateTo).toLocaleDateString()}
            </p>

            <div className="flex justify-between items-center">
              <Link
                to={`/venue/${booking.venue.id}`}
                className="text-amber-500 text-xs uppercase tracking-wider hover:text-amber-400"
              >
                View Venue
              </Link>

              <button
                onClick={() => handleCancelBooking(booking.id)}
                className="bg-red-700 text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-red-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

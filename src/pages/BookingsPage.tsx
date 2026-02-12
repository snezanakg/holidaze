import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar } from "lucide-react";

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue: {
    id: string;
    name: string;
    media?: { url: string }[];
  };
}

export function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("holidaze_token");

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${user?.name}/bookings?_venue=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookings(data.data);
      } else {
        console.error("Failed to fetch bookings", data);
      }
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-8 text-gold-gradient">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">You have no bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-stone-900 p-6 rounded-lg luxury-border"
            >
              <div className="flex gap-6 items-center">
                <img
                  src={
                    booking.venue.media?.[0]?.url ||
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
                  }
                  alt={booking.venue.name}
                  className="w-32 h-24 object-cover rounded"
                />

                <div>
                  <h2 className="text-xl font-semibold">
                    {booking.venue.name}
                  </h2>

                  <div className="flex items-center gap-2 text-gray-400 mt-2">
                    <Calendar size={16} />
                    {new Date(booking.dateFrom).toLocaleDateString()} –{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </div>

                  <p className="text-sm text-gray-400 mt-1">
                    Guests: {booking.guests}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

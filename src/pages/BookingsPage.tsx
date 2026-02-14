
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = "2ae3e868-69f2-430f-b7cb-5f7d53949d57";

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue: {
    name: string;
  };
}

export default function BookingsPage() {
  const { user } = useAuth();
  const token = localStorage.getItem("holidaze_token");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFrom, setEditFrom] = useState("");
  const [editTo, setEditTo] = useState("");

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

  async function handleDelete(id: string) {
    if (!confirm("Delete this booking?")) return;

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
        throw new Error("Failed to delete booking");
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Error deleting booking");
    }
  }

  async function handleUpdate(id: string) {
    try {
      const response = await fetch(
        `${API_BASE}/holidaze/bookings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify({
            dateFrom: editFrom,
            dateTo: editTo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message);
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? data.data : b))
      );

      setEditingId(null);
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) {
    return <p className="p-6 text-stone-400">Loading bookings...</p>;
  }

  return (
    <div className="min-h-screen bg-stone-950 py-12 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif text-white mb-10 uppercase tracking-wider">
        My Bookings
      </h1>

      {bookings.length === 0 && (
        <p className="text-stone-500">You have no bookings yet.</p>
      )}

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-stone-900 border border-stone-800 p-6"
          >
            <h2 className="text-white text-xl font-serif mb-2">
              {booking.venue.name}
            </h2>

            {editingId === booking.id ? (
              <>
                <div className="space-y-3 mb-4">
                  <input
                    type="date"
                    value={editFrom}
                    onChange={(e) => setEditFrom(e.target.value)}
                    className="w-full p-2 bg-stone-950 border border-stone-800 text-white"
                  />
                  <input
                    type="date"
                    value={editTo}
                    onChange={(e) => setEditTo(e.target.value)}
                    className="w-full p-2 bg-stone-950 border border-stone-800 text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(booking.id)}
                    className="bg-amber-600 px-4 py-2 text-xs uppercase text-white"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-stone-700 px-4 py-2 text-xs uppercase text-white"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-stone-400 mb-4">
                  {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(booking.id);
                      setEditFrom(booking.dateFrom.split("T")[0]);
                      setEditTo(booking.dateTo.split("T")[0]);
                    }}
                    className="bg-amber-600 px-4 py-2 text-xs uppercase text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="bg-red-700 px-4 py-2 text-xs uppercase text-white"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
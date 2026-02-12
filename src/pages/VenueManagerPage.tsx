import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  media?: { url: string }[];
  owner?: {
    name: string;
    email: string;
  };
}

export function VenueManagerPage() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("holidaze_token");

  // ✅ Fetch ONLY venues owned by logged in user
  const fetchMyVenues = async () => {
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${user?.name}/venues?_owner=true&_bookings=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setVenues(data.data);
      } else {
        console.error("Failed to fetch venues:", data);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyVenues();
    }
  }, [user]);

  // ✅ Delete venue
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setVenues((prev) => prev.filter((venue) => venue.id !== id));
      } else {
        console.error("Failed to delete venue");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        Loading your venues...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold-gradient">
          Venue Manager
        </h1>

        <button className="bg-gold-gradient px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18} />
          Create Venue
        </button>
      </div>

      {venues.length === 0 ? (
        <p className="text-gray-400">You have not created any venues yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-stone-900 rounded-lg overflow-hidden luxury-border luxury-border-hover"
            >
              <img
                src={
                  venue.media?.[0]?.url ||
                  "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
                }
                alt={venue.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {venue.name}
                </h2>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {venue.description}
                </p>

                <p className="text-gold-gradient font-bold mb-4">
                  ${venue.price} / night
                </p>

                <button
                  onClick={() => handleDelete(venue.id)}
                  className="flex items-center gap-2 text-red-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

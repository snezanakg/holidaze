import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = "2ae3e868-69f2-430f-b7cb-5f7d53949d57";

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media: { url: string }[];
}

export default function VenueManagerPage() {
  const { user } = useAuth();
  const token = localStorage.getItem("holidaze_token");

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 100,
    maxGuests: 2,
    imageUrl: "",
  });

  useEffect(() => {
    if (!user) return;

    async function fetchVenues() {
      try {
        const response = await fetch(
          `${API_BASE}/holidaze/profiles/${user.name}/venues`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          }
        );

        const data = await response.json();
        setVenues(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch(`${API_BASE}/holidaze/venues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        maxGuests: Number(formData.maxGuests),
        media: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
        location: {
          address: "Unknown",
          city: "Oslo",
          zip: "0000",
          country: "Norway",
          continent: "Europe",
        },
        meta: {
          wifi: false,
          parking: false,
          breakfast: false,
          pets: false,
        },
      }),
    });

    const data = await response.json();

    setVenues([...venues, data.data]);
    setShowCreate(false);
    resetForm();
  }

  function startEdit(venue: Venue) {
    setEditingVenueId(venue.id);
    setFormData({
      name: venue.name,
      description: venue.description,
      price: venue.price,
      maxGuests: venue.maxGuests,
      imageUrl: venue.media?.[0]?.url || "",
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingVenueId) return;

    const response = await fetch(
      `${API_BASE}/holidaze/venues/${editingVenueId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          maxGuests: Number(formData.maxGuests),
          media: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
        }),
      }
    );

    const data = await response.json();

    setVenues((prev) =>
      prev.map((v) => (v.id === editingVenueId ? data.data : v))
    );

    setEditingVenueId(null);
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this venue?")) return;

    await fetch(`${API_BASE}/holidaze/venues/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    setVenues((prev) => prev.filter((v) => v.id !== id));
  }

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      price: 100,
      maxGuests: 2,
      imageUrl: "",
    });
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-10 max-w-6xl mx-auto text-white">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Venues</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-amber-600 px-6 py-2"
        >
          + Add Venue
        </button>
      </div>

      {(showCreate || editingVenueId) && (
        <form
          onSubmit={editingVenueId ? handleUpdate : handleCreate}
          className="bg-stone-900 p-6 mb-8 space-y-4"
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full p-2 bg-stone-800"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full p-2 bg-stone-800"
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 bg-stone-800"
          />
          <input
            name="maxGuests"
            type="number"
            value={formData.maxGuests}
            onChange={handleChange}
            className="w-full p-2 bg-stone-800"
          />
          <input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full p-2 bg-stone-800"
          />

          <button className="bg-green-600 px-6 py-2">
            {editingVenueId ? "Update Venue" : "Create Venue"}
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-stone-900 p-6">
            {venue.media?.[0]?.url && (
              <img
                src={venue.media[0].url}
                alt={venue.name}
                className="mb-4 h-40 w-full object-cover"
              />
            )}

            <h2 className="text-xl font-semibold">{venue.name}</h2>
            <p className="text-sm mb-2">{venue.description}</p>
            <p className="text-amber-500 mb-4">${venue.price}</p>

            <div className="flex gap-3">
              <button
                onClick={() => startEdit(venue)}
                className="bg-blue-600 px-4 py-1 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(venue.id)}
                className="bg-red-600 px-4 py-1 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from "react";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = "2ae3e868-69f2-430f-b7cb-5f7d53949d57";

interface Props {
  onClose: () => void;
  onCreated: (venue: any) => void;
}

export default function CreateVenueForm({ onClose, onCreated }: Props) {
  const token = localStorage.getItem("holidaze_token");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(100);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/holidaze/venues`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify({
            name,
            description,
            price: Number(price),
            maxGuests: 2,
            media: [],
            location: {
              address: "Unknown",
              city: "Unknown",
              country: "Norway",
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message);
      }

      onCreated(data.data);
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-stone-900 border border-stone-800 p-6 mb-10">
      <h2 className="text-white font-serif text-xl mb-6">
        Create New Venue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Venue Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-stone-950 border border-stone-800 text-white"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-stone-950 border border-stone-800 text-white"
          required
        />

        <input
          type="number"
          placeholder="Price per night"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full p-3 bg-stone-950 border border-stone-800 text-white"
          required
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 px-6 py-2 text-white uppercase text-xs"
          >
            {loading ? "Creating..." : "Create"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-stone-800 px-6 py-2 text-white uppercase text-xs"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}

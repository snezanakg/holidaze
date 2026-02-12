import { useState } from "react";

interface BookingFormProps {
  venueId: string;
}

export function BookingForm({ venueId }: BookingFormProps) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("holidaze_token");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dateFrom,
            dateTo,
            guests,
            venueId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Booking failed");
      }

      setMessage("Booking successful 🎉");
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Book This Venue</h2>

      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        required
        className="w-full p-2 rounded bg-stone-800"
      />

      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        required
        className="w-full p-2 rounded bg-stone-800"
      />

      <input
        type="number"
        value={guests}
        min="1"
        onChange={(e) => setGuests(Number(e.target.value))}
        className="w-full p-2 rounded bg-stone-800"
      />

      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded font-semibold"
      >
        Book Now
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, updateAvatar } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <p className="text-center mt-20 text-stone-400">
        You must be logged in.
      </p>
    );
  }

  async function handleUpdateAvatar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateAvatar(avatarUrl);
      setMessage("Avatar updated successfully!");
      setAvatarUrl("");
    } catch (error) {
      setMessage("Failed to update avatar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 py-12 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif text-white uppercase tracking-widest mb-10">
        My Profile
      </h1>

      {/* PROFILE INFO */}
      <div className="bg-stone-900 border border-stone-800 p-8 mb-10">
        <div className="flex items-center gap-6">
          <img
            src={
              user.avatar?.url ||
              "https://placehold.co/150x150?text=Avatar"
            }
            alt="Profile avatar"
            className="w-32 h-32 object-cover rounded-full border border-stone-700"
          />

          <div>
            <p className="text-white text-xl font-serif">
              {user.name}
            </p>
            <p className="text-stone-400">
              {user.email}
            </p>
            <p className="text-amber-500 mt-2 text-sm uppercase">
              {user.venueManager ? "Venue Manager" : "Customer"}
            </p>
          </div>
        </div>
      </div>

      {/* UPDATE AVATAR */}
      <div className="bg-stone-900 border border-stone-800 p-8">
        <h2 className="text-xl font-serif text-white mb-6">
          Update Profile Picture
        </h2>

        <form onSubmit={handleUpdateAvatar} className="space-y-4">
          <input
            type="url"
            placeholder="Paste image URL..."
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            required
            className="w-full p-3 bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-amber-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Avatar"}
          </button>

          {message && (
            <p className="text-sm mt-4 text-stone-400">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

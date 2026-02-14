export const API_BASE = "https://v2.api.noroff.dev";

const API_KEY = "2ae3e868-69f2-430f-b7cb-5f7d53949d57";

export async function fetchFromApi(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("holidaze_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Something went wrong");
  }

  return data;
}

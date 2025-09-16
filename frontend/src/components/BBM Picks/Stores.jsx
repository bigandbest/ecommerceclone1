import React, { useEffect, useState } from "react";
import { fetchBbmPicks } from "../../utils/supabaseApi.js";

export default function BBMPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchBbmPicks();
        setPicks(data);
      } catch (err) {
        console.error("Error fetching BBM Picks:", err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {picks.map((pick) => (
        <div key={pick.id} className="flex flex-col items-center">
          <img
            src={pick.image_url}
            alt={pick.name}
            className="w-20 h-20 rounded-md object-cover mb-1"
          />
          <p className="text-sm font-medium">{pick.name}</p>
        </div>
      ))}
    </div>
  );
}

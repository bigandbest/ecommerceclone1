// src/components/QuickPicks.jsx (formerly BBMPicks in Stores.jsx)

import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
// 1. Import the new axios-based function
import { fetchQuickPicks } from "../../utils/supabaseApi.js";

export default function QuickPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 2. Call the new function to fetch quick picks
        const data = await fetchQuickPicks();
        setPicks(data || []);
      } catch (err) {
        // 3. Update the error message for clarity
        console.error("Error fetching Quick Picks:", err.message);
        setPicks([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <h2 className="pl-3 pt-2 flex">Quick Picks <ChevronRight /></h2>
    <div className="flex space-x-4 overflow-x-auto p-3 hide-scrollbar h-30">
      {picks.map((pick) => (
        <div key={pick.id} className="flex flex-col items-center flex-shrink-0">
          <img
            src={pick.image_url}
            alt={pick.name}
            className="w-20 h-20 rounded-md object-contain mb-1"
          />
          <p className="text-sm font-medium text-center w-20">{pick.name}</p>
        </div>
      ))}
    </div>
    </>
  );
}
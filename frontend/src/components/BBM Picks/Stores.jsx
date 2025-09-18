import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { fetchQuickPicks } from "../../utils/supabaseApi.js";

function Stores({
  title = "Recommended Store",
  items = [],
  mode = "scroll",
  forceShow = false // 👈 NEW PROP
}) {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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


  // Only show on home route (keep your existing check if needed)
  if (!forceShow && location.pathname !== "/") {
    return null;
  }

  // Conditional classNames
  const containerClass =
    mode === "grid"
      ? "grid grid-cols-3 gap-1" // 👈 3x3 grid
      : "flex overflow-x-auto hide-scrollbar snap-x"; // 👈 scroll

  const imageClass =
    mode === "grid"
      ? "grid grid-cols-3 gap-2" // 👈 3x3 grid
      : "flex overflow-x-auto hide-scrollbar snap-x"; // 👈 scroll

  const itemClass =
    mode === "grid"
      ? "flex flex-col items-center" // grid item
      : "flex flex-col items-center flex-shrink-0 w-[55%] mr-1 snap-start"; // scroll item

  return (
    <div className="w-full gap-4 md:hidden p-3">
      {/* Section Title */}
      <h2 className="flex text-sm font-semibold text-gray-900 mb-3">
        Quick Picks <ChevronRight />
      </h2>

      {/* Items */}
      <div className={containerClass}>
        {picks.map((pick) => (
          <div key={pick.id} className={itemClass}>
            {/* Card Style Image */}
              <div className="w-full rounded-md overflow-hidden">
                <img
                  src={pick.image_url}
                  alt={pick.name}
                  className="w-full h-full rounded-md object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/100x100?text=Image";
                  }}
                />
              </div>
          
            {/* Label */}
            <p className="mt-1 text-md font-semibold text-gray-700 text-center truncate w-full">
              {pick.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stores;

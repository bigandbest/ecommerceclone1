import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "https://ecommerceclone1.onrender.com/api/brand";

const FeaturedThisWeek = () => {
  const location = useLocation();
  const [featuredItems, setFeaturedItems] = useState([]);

  if (location.pathname !== "/") return null;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_URL}/list`);
        const formattedBrands = response.data.brands.map(brand => ({
          id: brand.id,
          label: brand.name,
          img: brand.image_url,
          tag: "Featured",
        }));
        setFeaturedItems(formattedBrands);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="block md:hidden px-3 py-2 bg-white">
      <h2 className="text-lg font-semibold mb-3">Featured this week</h2>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar">
        {featuredItems.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-[28%] sm:w-[24%] rounded-xl shadow-md overflow-hidden border bg-white"
          >
            {/* Added aspect-square and w-full to force a perfect square container */}
            <div className="relative w-full"> 
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedThisWeek;
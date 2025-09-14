import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingBasket,
  PrinterCheck,
  Shirt,
  Utensils,
  ShieldPlus,
  X,
} from "lucide-react";
import BbmPicks from "../../components/BBM Picks/BbmPick";
import Quickyfy from "../../components/BBM Picks/Quickyfy";
import Stores from "../../components/BBM Picks/Stores";
import { getActiveCategories } from "../../utils/supabaseApi.js"; // 👈 import API function
import { useNavigate, useLocation } from "react-router-dom";


const menuItems = [
  {
    name: "Grocery",
    icon: <ShoppingBasket />,
    img: "https://i.postimg.cc/CMjGTTK4/Grocery.avif",
  },
  {
    name: "Branding",
    icon: <PrinterCheck />,
    img: "https://i.postimg.cc/VNzkJTCT/Candle5.jpg",
  },
  {
    name: "Fashion",
    icon: <Shirt />,
    img: "https://i.postimg.cc/tgkhZFLm/Fashion.webp",
  },
  {
    name: "Eatry",
    icon: <Utensils />,
    img: "https://i.postimg.cc/WzkFnZHV/Eatry.avif",
  },
  {
    name: "Plus",
    icon: <ShieldPlus />,
    img: "https://i.postimg.cc/VNzkJTCT/Candle5.jpg",
  },
];

const data = [
  { image: "https://i.postimg.cc/Tw85NQLJ/Candle2.jpg", label: "Office" },
  { image: "https://i.postimg.cc/Tw85NQLJ/Candle2.jpg", label: "Packaging" },
  { image: "https://i.postimg.cc/Tw85NQLJ/Candle2.jpg", label: "Essentia" },
  { image: "https://i.postimg.cc/Tw85NQLJ/Candle2.jpg", label: "Plus" },
  { image: "https://i.postimg.cc/Tw85NQLJ/Candle2.jpg", label: "More" },
];
const Seconddata = [
  {
    image:
      "https://i.postimg.cc/zfvZpS8G/digital-digital-art-artwork-futuristic-futuristic-city-hd-wallpaper-preview.jpg",
    label: "Office",
  },
  {
    image:
      "https://i.postimg.cc/zfvZpS8G/digital-digital-art-artwork-futuristic-futuristic-city-hd-wallpaper-preview.jpg",
    label: "Packaging",
  },
  {
    image:
      "https://i.postimg.cc/zfvZpS8G/digital-digital-art-artwork-futuristic-futuristic-city-hd-wallpaper-preview.jpg",
    label: "Essentia",
  },
  {
    image:
      "https://i.postimg.cc/zfvZpS8G/digital-digital-art-artwork-futuristic-futuristic-city-hd-wallpaper-preview.jpg",
    label: "Plus",
  },
  {
    image:
      "https://i.postimg.cc/zfvZpS8G/digital-digital-art-artwork-futuristic-futuristic-city-hd-wallpaper-preview.jpg",
    label: "More",
  },
];
const Thirddata = [
  {
    image:
      "https://i.postimg.cc/zfFgL0VR/Whats-App-Image-2025-07-24-at-13-27-17.jpg",
    label: "Office",
  },
  {
    image:
      "https://i.postimg.cc/zfFgL0VR/Whats-App-Image-2025-07-24-at-13-27-17.jpg",
    label: "Packaging",
  },
  {
    image:
      "https://i.postimg.cc/zfFgL0VR/Whats-App-Image-2025-07-24-at-13-27-17.jpg",
    label: "Essentia",
  },
  {
    image:
      "https://i.postimg.cc/zfFgL0VR/Whats-App-Image-2025-07-24-at-13-27-17.jpg",
    label: "Plus",
  },
  {
    image:
      "https://i.postimg.cc/zfFgL0VR/Whats-App-Image-2025-07-24-at-13-27-17.jpg",
    label: "More",
  },
];

export default function AllCategoriesPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [linePos, setLinePos] = useState({ top: 0, height: 0 });
  const [showDrawer, setShowDrawer] = useState(false);
  const [categories, setCategories] = useState([]); // 👈 state for fetched categories
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const buttonRefs = useRef([]);
  const menuContainerRef = useRef(null);

  const { state } = useLocation();

  useEffect(() => {
    if (state?.fromAllCategories) {
      setActive(state.active);       // restore sidebar highlight
      setShowDrawer(state.showDrawer); // reopen drawer
    }
  }, [state]);

  useEffect(() => {
    const index = menuItems.findIndex((item) => item.name === active);
    const btn = buttonRefs.current[index];
    if (btn && menuContainerRef.current) {
      const rect = btn.getBoundingClientRect();
      const containerRect = menuContainerRef.current.getBoundingClientRect();
      setLinePos({
        top: rect.top - containerRect.top,
        height: rect.height,
      });
    }
  }, [active]);

  // 👇 fetch categories when drawer opens
  useEffect(() => {
    if (showDrawer) {
      (async () => {
        const { success, categories, error } = await getActiveCategories();
        if (success) {
          setCategories(categories);
        } else {
          console.error(error);
        }
      })();
    }
  }, [showDrawer]);

  const handleSidebarClick = (button) => {
    setActiveSidebar(button.name);   // drawer header
    setActiveCategory(null);         // optional reset category
  };

  const handleCategoryClick = (category, parentButton) => {
    setActiveCategory(category.name); // not mandatory
    navigate(`/category/${category.id}/${category.name}`, {
      state: {
        fromAllCategories: true,
        activeSidebar: parentButton.name, // always pass sidebar button name
        showDrawer: true
      }
    });
  };

  return (
    <div className="sm:hidden fixed top-0 left-0 h-full w-full flex z-40">
      {/* Sidebar (always open) */}
      <div className="relative bg-white border-r shadow-lg flex flex-col items-center w-20">
        <div
          ref={menuContainerRef}
          className="flex flex-col w-full items-center relative"
        >
          {/* Active tracker line */}
          <div
            className="absolute left-0 w-1 bg-blue-500 rounded-r transition-all duration-300 ease-in-out"
            style={{
              top: `${linePos.top}px`,
              height: `${linePos.height}px`,
            }}
          ></div>

          {/* Sidebar Items */}
          <div className="flex flex-col gap-2 w-full items-center">
            {menuItems.map((item, index) => (
              <button
                key={item.name}
                ref={(el) => (buttonRefs.current[index] = el)}
                onClick={() => {
                  setActive(item.name);
                  setShowDrawer(true);
                  handleSidebarClick(item);
                }}
                className={`relative flex flex-col items-center justify-center w-full py-1 !ml-0 transition transform active:scale-95
                  ${active === item.name
                    ? "text-blue-600"
                    : "hover:bg-gray-100 text-gray-600"
                  }
                `}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <span className="text-sm text-black mt-1">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content (Static) */}
      <div className="flex-1 bg-gray-50 transition-all duration-300 overflow-y-auto min-h-[100%] hide-scrollbar pb-24">
        <Stores title="BBM Picks" items={Seconddata} mode="grid" forceShow />
        <BbmPicks title="Recommended Store" items={data} mode="grid" forceShow />
        <Quickyfy title="Quickyfy" items={Thirddata} mode="grid" forceShow className='mb-20' />
      </div>

      {/* Bottom Drawer Modal */}
      <div
        className={`fixed inset-x-0 bottom-0 top-12 flex flex-col bg-white rounded-t-2xl shadow-lg transform transition-transform duration-300 ease-in-out z-50
    ${showDrawer ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b shrink-0">
          <h2 className="text-lg font-semibold text-black">{active}</h2>
          <button
            onClick={() => setShowDrawer(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="grid grid-cols-2 gap-4 pb-8">
            {categories.length > 0 ? (
              categories.map((cat) => {
                // safely find the sidebar button
                const parentButton = menuItems.find((item) => item.name === active);
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.name); // category highlight (optional)
                      setActive(parentButton?.name || "Menu"); // set drawer heading
                      navigate(`/category/${cat.id}/${cat.name}`, {
                        state: {
                          fromAllCategories: true,
                          activeSidebar: parentButton?.name || "Menu",
                          showDrawer: true,
                        },
                      });
                    }}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg shadow hover:bg-gray-100 transition"
                  >

                    <img
                      src={cat.image_url || "https://placehold.co/150x150?text=Category"}
                      alt={cat.name}
                      className="w-40 h-40 rounded-md object-cover"
                    />
                    <span className="mt-2 text-sm font-medium text-black text-center">
                      {cat.name}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center w-full">Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

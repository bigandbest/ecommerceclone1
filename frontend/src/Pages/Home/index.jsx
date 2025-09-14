import React, { useState, useEffect } from "react";
import HomeSlider from "../../components/HomeSlider";
import Search from "../../components/Search";
import { FaShippingFast } from "react-icons/fa";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useAuth } from "../../contexts/AuthContext";
import ProductsSlider from "../../components/ProductsSlider";
import { useLocationContext } from "../../contexts/LocationContext.jsx";
import VideoBannerSlider from '../../components/HomeSlider/VideoSlider.jsx'
import ProductsNew from "../LastMobileProducts/LastMobileProducts.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import HomeFestivalGrid from "../../components/BBM Picks/HomeFestivalsGrid.jsx";
import FeaturedThisWeek from "../../components/BBM Picks/FeaturingSection.jsx";
import ProductGrid3X3 from "../../components/NewSection/ProductGrid3X3.jsx";
import EigthProductSection from "../../components/NewSection/EigthProductSection.jsx";
import ProductGrid2X2 from "../../components/NewSection/ProductGrid2X2.jsx";
import BannerImagesSlider from "../../components/NewSection/BannerImagesSlider.jsx";
import ProductBannerSlider from "../../components/NewSection/ProductBannerSlider.jsx";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import required modules
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import {
  getDefaultUserAddress,
  getNearbyProducts,
  getAllProducts,
  getAllCategories,
  getAllBanners,
  getshipping,
} from "../../utils/supabaseApi";
import { usePromotional } from "../../contexts/PromotionalContext.jsx";
import FlashSale from "../../components/FlashSale";
import "./home.css";
import { getActiveShippingBanner } from "../../utils/supabaseApi";

function ProductTabs({ categories }) {
  const [value, setValue] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        typography: {
          fontSize: {
            xs: "0.8rem",
            sm: "0.875rem",
          },
        },
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="product category tabs"
        sx={{
          "& .MuiTab-root": {
            minHeight: "44px",
            padding: "8px 16px",
            fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
          },
        }}
      >
        <Tab label="All Products" />
        {categories &&
          categories
            .filter((cat) => cat.active)
            .map((cat) => <Tab key={cat.id} label={cat.name} />)}
      </Tabs>
    </Box>
  );
}

export const Home = () => {
  const { getPromoSetting } = usePromotional();
  const navigate = useNavigate();

  // Supabase-driven product/category/banner state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [shippingBanners, setShippingBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingBanner, setShippingBanner] = useState(null);
  /* const [defaultAddress, setDefaultAddress] = useState(null); */

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAnnouncementBar, setHasAnnouncementBar] = useState(false);
  const { selectedAddress } = useLocationContext();

  /* const { currentUser } = useAuth(); */ // 👈 Get from context
  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);

      let productFetchFn;

      try {
        if (selectedAddress?.latitude && selectedAddress?.longitude) {
          productFetchFn = () =>
            getNearbyProducts(
              selectedAddress.latitude,
              selectedAddress.longitude
            );
          /* console.log("Selected Address:", selectedAddress); */
        } else {
          productFetchFn = getAllProducts;
        }
      } catch (err) {
        console.error("Error determining product fetch method:", err);
        productFetchFn = getAllProducts;
      }

      const [
        { success: prodSuccess, products: prodData },
        { success: catSuccess, categories: catData },
        { success: banSuccess, banners: banData },
      ] = await Promise.all([
        productFetchFn(),
        getAllCategories(),
        getAllBanners(),
      ]);
      setProducts(
        prodSuccess && prodData
          ? prodData.map((p) => ({ ...p, id: p.id || p.product_id }))
          : []
      );
      /* console.log("Fetching nearby products using address:", products); */
      setCategories(catSuccess && catData ? catData : []);
      setBanners(banSuccess && banData ? banData : []);
      setLoading(false);
    }

    fetchAllData();
    async function fetchShippingBanner() {
      const { success, banner } = await getActiveShippingBanner();
      if (success && banner) {
        setShippingBanner(banner);
      }
    }
    fetchShippingBanner();
  }, [selectedAddress]);

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        setLoading(true);
        const result = await getshipping();
        /* console.log("resultshipping", result); */
        if (result.success && Array.isArray(result.banners)) {
          const shipBanner = result.banners.filter(b => b.active);
          setShippingBanners(shipBanner.map(b => ({
            id: b.id,
            title: b.title,
            imageUrl: b.image || b.image_url,
          })));
          /* console.log("Shipping Banners:", shipBanner); */
        } else {
          setShippingBanners([]);
        }
      } catch (error) {
        setError('Failed to load banners');
        setShippingBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShipping();
  }, []);


  /* const getProductsByCategory = (category) => {
    return products
      .filter(
        (product) =>
          (product.category || "").toLowerCase() === category.toLowerCase()
      )
      .slice(0, 8);
  }; */

  const popularProducts = products
    .filter((product) => product.popular)
    .slice(0, 10);
  const newProducts = products.slice(0, 10);
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 10);

  const topSaleProducts = products
    .filter((product) => product.top_sale)
    .slice(0, 10);
  const mostOrderedProducts = products
    .filter((product) => product.most_orders)
    .slice(0, 10);
  const topRatedProducts = products
    .filter((product) => product.top_rating)
    .slice(0, 10);
  const limitedProducts = products
    .filter((product) => product.limited_product)
    .slice(0, 10);
  const seasonalProducts = products
    .filter((product) => product.seasonal_product)
    .slice(0, 10);
  const internationalProducts = products
    .filter((product) => product.international_product)
    .slice(0, 10);

  const dynamicSections = [
    { key: "top_sale", label: "Top Sale", products: topSaleProducts },
    {
      key: "most_orders",
      label: "Most Ordered",
      products: mostOrderedProducts,
    },
    { key: "top_rating", label: "Top Rated", products: topRatedProducts },
    {
      key: "limited_product",
      label: "Limited Stock",
      products: limitedProducts,
    },
    {
      key: "seasonal_product",
      label: "Seasonal Picks",
      products: seasonalProducts,
    },
    {
      key: "international_product",
      label: "International Products",
      products: internationalProducts,
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  // Search handler
  /* const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/productListing?search=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  }; */

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Check if announcement bar is present
  useEffect(() => {
    const checkAnnouncementBar = () => {
      const announcementElement = document.querySelector(".announcement-bar");
      setHasAnnouncementBar(!!announcementElement);
    };

    checkAnnouncementBar();

    // Listen for changes in case announcement bar is dynamically added/removed
    const observer = new MutationObserver(checkAnnouncementBar);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const sectionData = [
    {
      title: "Best quality",
      products: [
        {
          label: "Men's Jeans",
          tagline: "Most-loved",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's Ethnic Sets",
          tagline: "Best Picks",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's T-shirts",
          tagline: "Top-rated",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Skipping Ropes",
          tagline: "Hot Deal",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
      ],
    },
    {
      title: "Trending Now",
      products: [
        {
          label: "Smart Watches",
          tagline: "Bestseller",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Shoes",
          tagline: "New Arrival",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's T-shirts",
          tagline: "Top-rated",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Skipping Ropes",
          tagline: "Hot Deal",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
      ],
    },
    {
      title: "Trending Now",
      products: [
        {
          label: "Smart Watches",
          tagline: "Bestseller",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Shoes",
          tagline: "New Arrival",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's T-shirts",
          tagline: "Top-rated",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Skipping Ropes",
          tagline: "Hot Deal",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
      ],
    },
  ];
  const sectionData2 = [
    {
      title: "Best quality",
      products: [
        {
          label: "Men's Jeans",
          tagline: "Most-loved",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's Ethnic Sets",
          tagline: "Best Picks",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's T-shirts",
          tagline: "Top-rated",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Skipping Ropes",
          tagline: "Hot Deal",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
      ],
    },
    {
      title: "Trending Now",
      products: [
        {
          label: "Smart Watches",
          tagline: "Bestseller",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Shoes",
          tagline: "New Arrival",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's T-shirts",
          tagline: "Top-rated",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Skipping Ropes",
          tagline: "Hot Deal",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
      ],
    },
  ];
  const sectionData3 = [
    {
      title: "Best quality",
      products: [
        {
          label: "Men's Jeans",
          tagline: "Most-loved",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's Ethnic Sets",
          tagline: "Best Picks",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's T-shirts",
          tagline: "Top-rated",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Skipping Ropes",
          tagline: "Hot Deal",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
      ],
    },
    {
      title: "Trending Now",
      products: [
        {
          label: "Smart Watches",
          tagline: "Bestseller",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Shoes",
          tagline: "New Arrival",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's T-shirts",
          tagline: "Top-rated",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Skipping Ropes",
          tagline: "Hot Deal",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
      ],
    },
    {
      title: "Best quality",
      products: [
        {
          label: "Men's Jeans",
          tagline: "Most-loved",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's Ethnic Sets",
          tagline: "Best Picks",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Men's T-shirts",
          tagline: "Top-rated",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
        {
          label: "Skipping Ropes",
          tagline: "Hot Deal",
          image: "https://i.postimg.cc/B6gYq8Gk/Candle6.jpg",
        },
      ],
    },
  ];

  return (
    <>
      {/* Search Bar For mobile Screens */}


      {/* Add spacer to push content below the search bar on mobile */}
      {/* <div
        className="mobile-search-spacer md:hidden"
        style={{ height: "60px" }}
      ></div> */}

      <HomeSlider />
      <FlashSale />
      <HomeFestivalGrid />
      <FeaturedThisWeek />
      <BannerImagesSlider
        count={3}
        bannerUrl="https://i.postimg.cc/W4pL05Hw/Opening-Soon.png"
      />

      {/* ================== PROMOTIONAL BANNER ================== */}
      {/* Desktop version (lg and up) */}

      <section className="!p-5 bg-white md:hidden md:justify-center">
        {shippingBanners && shippingBanners.length > 0 ? (
          <div className="w-full h-full border-0 rounded relative">
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={true}
              autoplay={true}
              autoplaySpeed={4000}
              className="rounded-lg"
            >
              {shippingBanners.map((banner) => (
                <a
                  href={banner.link}
                  key={banner.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block"
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {/* Optional overlay with title and description */}
                  {/* {(banner.title || banner.description) && (
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white p-3 rounded">
                      {banner.title && <h3 className="font-bold">{banner.title}</h3>}
                      {banner.description && (
                        <p className="text-sm mt-1">{banner.description}</p>
                      )}
                    </div>
                  )} */}
                </a>
              ))}
            </Slider>
          </div>
        ) : (
          <></>
        )}
      </section>

      <VideoBannerSlider />
      <ProductGrid3X3 />
      <BannerImagesSlider
        count={2}
        bannerUrl="https://i.postimg.cc/mrVcS62L/Untitled-design-1.png"
      />
      <EigthProductSection sectionCount={2} startIndex={0} />
      <div className="p-4 bg-white md:hidden">
        {sectionData.map((section, idx) => (
          <ProductGrid2X2
            key={idx}
            title={section.title}
            products={section.products}
          />
        ))}
      </div>
      <ProductBannerSlider
        count={1}
        bannerUrl="https://i.postimg.cc/hv8MvxF5/Explore-More-now-1.png"
      />

      <EigthProductSection sectionCount={3} startIndex={2} />
      <ProductBannerSlider
        count={1}
        bannerUrl="https://i.postimg.cc/hv8MvxF5/Explore-More-now-1.png"
      />
      <EigthProductSection sectionCount={1} startIndex={5} />

      <div className="p-4 bg-white md:hidden">
        {sectionData2.map((section, idx) => (
          <ProductGrid2X2
            key={idx}
            title={section.title}
            products={section.products}
          />
        ))}
      </div>

      <EigthProductSection sectionCount={2} startIndex={6} />

      {/* Popular Products Section */}
      <section className="bg-white sm:!py-10 !py-0 mt-0 md:flex md:justify-center">
        <div className="px-2 md:container md:px-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full flex items-center justify-between ">
              <h2 className="text-xl sm:text-2xl font-semibold mt-5">
                Popular Products
              </h2>
              <a
                href="/productListing"
                className="text-sm text-blue-600 hover:underline mt-5 items-center flex align-middle"
              >
                View All
              </a>
            </div>
            {/* <div className="w-full md:w-auto md:flex-1">
              <ProductTabs />
            </div> */}
          </div>

          {/* {console.log("Popular Products:", popularProducts)} */}
          <ProductsSlider
            products={popularProducts}
            slidesPerViewMobile={2.5}
            slidesPerViewTablet={2.5}
            slidesPerViewDesktop={4}
            slidesPerViewLarge={5}
          />
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="sm:!py-10 !py-0 md:flex md:justify-center bg-white">
        <div className="px-2 md:container md:px-10">
          <div className="flex items-center justify-between ">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Latest Products
            </h2>
            <a
              href="/productListing"
              className="text-sm text-blue-600 items-center flex align-middle hover:underline"
            >
              View All
            </a>
          </div>

          <ProductsSlider
            products={newProducts}
            slidesPerViewMobile={2.5}
            slidesPerViewTablet={2.5}
            slidesPerViewDesktop={4}
            slidesPerViewLarge={5}
          />
        </div>
      </section>
      <ProductBannerSlider
        count={1}
        bannerUrl="https://i.postimg.cc/hv8MvxF5/Explore-More-now-1.png"
      />

      <div className="p-4 bg-white md:hidden">
        {sectionData3.map((section, idx) => (
          <ProductGrid2X2
            key={idx}
            title={section.title}
            products={section.products}
          />
        ))}
      </div>

      {/* <section className="hidden md:block py-4 bg-white">
  <div className="container px-4">
    <div className="promotional-banner w-full lg:w-[95%] mx-auto
                    relative overflow-hidden rounded-xl shadow-lg
                    bg-gradient-to-r from-orange-100 via-red-50 to-orange-100
                    border-2 border-red-200">
    
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-56 h-56 bg-red-400 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-orange-300 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center justify-between py-6 px-8">
       
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500">
            <FaShippingFast className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-800 mb-1">
              {getPromoSetting("promo_shipping_title", "Free Shipping")}
            </h3>
            <p className="text-sm font-semibold text-red-600">Shop now</p>
          </div>
        </div>

     
        <p className="flex-1 text-center font-medium text-gray-800">
          {getPromoSetting(
            "promo_shipping_description",
            "Free delivery on your first order and over ₹500"
          )}
        </p>

       
        <div className="flex items-center gap-3 bg-white/90 px-4 py-2 rounded-md border">
          <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            BANK
          </span>
          <span className="text-sm font-bold text-gray-800">
            {getPromoSetting("promo_shipping_amount", "Only ₹500/-")}
          </span>
        </div>
      </div>
    </div>
  </div>
</section> */}

      {/* Mobile version (below lg) */}
      {/* <section className="md:hidden w-full">
  <img
    src={promoImage}
    alt="Special Mobile Offer"
    className="w-full h-auto object-cover"
  />
</section> */}
      {/* ========================================================= */}

      {/* Featured Products Section */}
      <section className="sm:!py-10 !py-0 md:flex md:justify-center bg-white">
        <div className="px-2 md:container md:px-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Featured Products
            </h2>
            <a
              href="/productListing"
              className="text-sm text-blue-600 hover:underline items-center flex align-middle"
            >
              View All
            </a>
          </div>

          <ProductsSlider
            products={featuredProducts}
            slidesPerViewMobile={2.5}
            slidesPerViewTablet={2.5}
            slidesPerViewDesktop={4}
            slidesPerViewLarge={5}
          />
        </div>
      </section>

      {dynamicSections.slice(0, 4).map(
        ({ key, label, products }, index) =>
          products.length > 0 && (
            <React.Fragment key={key}>
              <section className="sm:!py-10 !py-0 md:flex md:justify-center bg-white">
                <div className="px-2 md:container md:px-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      {label}
                    </h2>
                    <a
                      href="/productListing"
                      className="text-sm text-blue-600 hover:underline text-center flex items-center align-middle"
                    >
                      View All
                    </a>
                  </div>

                  <ProductsSlider
                    products={products}
                    slidesPerViewMobile={2.5}
                    slidesPerViewTablet={2.5}
                    slidesPerViewDesktop={4}
                    slidesPerViewLarge={5}
                  />
                </div>
              </section>
            </React.Fragment>
          )
      )}

      <div className="p-4 bg-white md:hidden">
        {sectionData2.map((section, idx) => (
          <ProductGrid2X2
            key={idx}
            title={section.title}
            products={section.products}
          />
        ))}
      </div>

      {dynamicSections.slice(4).map(
        ({ key, label, products }, index) =>
          products.length > 0 && (
            <React.Fragment key={key}>
              <section className="sm:!py-10 !py-0 md:flex md:justify-center bg-white">
                <div className="px-2 md:container md:px-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      {label}
                    </h2>
                    <a
                      href="/productListing"
                      className="text-sm text-blue-600 hover:underline text-center flex items-center align-middle"
                    >
                      View All
                    </a>
                  </div>

                  <ProductsSlider
                    products={products}
                    slidesPerViewMobile={2.5}
                    slidesPerViewTablet={2.5}
                    slidesPerViewDesktop={4}
                    slidesPerViewLarge={5}
                  />
                </div>
              </section>
            </React.Fragment>
          )
      )}

      <div className="p-4 bg-white md:hidden">
        {sectionData2.map((section, idx) => (
          <ProductGrid2X2
            key={idx}
            title={section.title}
            products={section.products}
          />
        ))}
      </div>

      <ProductsNew />
    </>
  );
};

export default Home;

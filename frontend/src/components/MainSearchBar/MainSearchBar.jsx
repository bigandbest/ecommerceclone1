import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Search from "../Search";

const MainSearchBar = () => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // You can change 768 based on your design

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // If user is on mobile and on /subcategories page (any category), hide the search bar
    if (isMobile && location.pathname.startsWith("/subcategories")) return null;
    if(location.pathname.startsWith("/category")) return null;
    if (location.pathname == "/all") {
    return null;
  }
    if (location.pathname == "/Notifications") {
    return null;
  }

    return (
        <div className="mobile-search-bar-container w-full px-2 py-1 ">
            <Search />
        </div>
    );
};

export default MainSearchBar;

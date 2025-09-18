import React, { useState, useEffect } from "react";
import { AdminAuthProvider, useAdminAuth } from "./contexts/AdminAuthContext";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { FaSearch, FaHome, FaUsers, FaBoxOpen, FaQuestionCircle } from 'react-icons/fa'; 

// Components
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import AuthenticationForm from "./Components/AuthenticationForm";

// Pages
import Dashboard from "./Pages/Dashboard";
import ProductsPage from "./Pages/Products";
import AddProduct from "./Pages/Products/AddProduct";
import CategoriesPage from "./Pages/Categories";
import AddCategory from "./Pages/Categories/AddCategory";
import BannersPage from "./Pages/Banners";
import AdsBannersPage from "./Pages/AdsBanners";
import UsersPage from "./Pages/Users";
import EnquiryPage from "./Pages/Enquiry";
import PrintRequestsPage from "./Pages/PrintRequests";
import Profile from "./Pages/Profile";
import Messages from "./Pages/Messages";
import Settings from "./Pages/Settings";
import PromotionalSettings from "./Pages/PromotionalSettings";
import StorageDetailsPage from "./Pages/Storage";
import BusinessUsersList from "./Pages/BusinessWork/BusinessData.jsx";
import EnhancedStoragePage from "./Pages/Storage/enhanced";
import WarehouseList from "./Pages/WarehousePages/WarehouseList.jsx";
import WarehouseProducts from './Pages/WarehousePages/WarehouseProducts.jsx';
import VideoBannerManagement from "./Pages/VideoBanners/VideoBannerManagement.jsx";
import AdminOrders from "./Pages/Orders/index.jsx";
import ShippingBanner from "./Pages/ShippingBanner/ShippingBanner.jsx";
import Notification from "./Pages/Notifications/Notification.jsx";
import StoreAdmin from "./Pages/Store/Store.jsx";
import RecommendedStore from "./Pages/RecommendedStore/RecommendedStore.jsx";
import RecommendedStoreProducts from "./Pages/RecommendedStore/RecommendedStoreProducts.jsx";
import QuickPicksPage from "./Pages/QuickPicks/QuickPicks.jsx";
import QuickPickGroupPage from "./Pages/QuickPicks/QuickPickGroup.jsx";
import QuickPickGroupProducts from "./Pages/QuickPicks/QuickPickGroupProducts.jsx";
import Brand from './Pages/Brand/Brand.jsx'
import BrandProducts from "./Pages/Brand/BrandProducts.jsx";
import Bnb from "./Pages/B&b/B&b.jsx";
import BnbGroup from "./Pages/B&b/B&bGroup.jsx";
import BnbGroupProducts from "./Pages/B&b/B&bGroupProducts.jsx";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen mantine-bg">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-[240px]' : 'ml-[70px]'}`}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto mantine-bg rounded-tl-xl shadow-inner p-4">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Actions for spotlight search
const spotlightActions = [
  {
    id: 'home',
    label: 'Dashboard',
    description: 'Go to dashboard',
    icon: <FaHome size={18} />,
    onClick: () => window.location.href = '/',
  },
  {
    id: 'products',
    label: 'Products',
    description: 'Manage your products',
    icon: <FaBoxOpen size={18} />,
    onClick: () => window.location.href = '/products',
  },
  {
    id: 'users',
    label: 'Users',
    description: 'Manage your users',
    icon: <FaUsers size={18} />,
    onClick: () => window.location.href = '/users',
  },
  {
    id: 'enquiry',
    label: 'Enquiries',
    description: 'View customer enquiries',
    icon: <FaQuestionCircle size={18} />,
    onClick: () => window.location.href = '/enquiry',
  },
];

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <AuthenticationForm />,
    },
    {
      element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/products",
          element: <ProductsPage />,
        },
        {
          path: "/products/add",
          element: <AddProduct />,
        },
        {
          path: "/categories",
          element: <CategoriesPage />,
        },
        {
          path: "/categories/add",
          element: <AddCategory />,
        },
        {
          path: "/banners",
          element: <BannersPage />,
        },
        {
          path: "/ads-banners",
          element: <AdsBannersPage />,
        },
        {
          path: "/users",
          element: <UsersPage />,
        },
        {
          path: "/enquiry",
          element: <EnquiryPage />,
        },
        {
          path: "/print-requests",
          element: <PrintRequestsPage />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/promotional-settings",
          element: <PromotionalSettings />,
        },
        {
          path: "/storage",
          element: <StorageDetailsPage />,
        },
        {
          path: "/storage/enhanced",
          element: <EnhancedStoragePage />,
        },
        {
          path: "/business-data",
          element: <BusinessUsersList />,
        },
        {
          path: "/warehouselist",
          element: <WarehouseList />,
        },
        {
          path: "/AdminOrders",
          element: <AdminOrders />,
        },
        {
          path: "/warehouseproducts/:id/products",
          element: <WarehouseProducts />,
        },
        {
          path: "/VideoBannerManagement",
          element: <VideoBannerManagement />,
        },
        {
          path: "/ShippingBanner",
          element: <ShippingBanner />,
        },
        {
          path: "/notifications",
          element: <Notification />,
        },
        {
          path: "/stores",
          element: <StoreAdmin />,
        }, {
          path: "/recommended-stores",
          element: <RecommendedStore />,
        },
        {
          path: "/recommendedstoreproducts/:id",
          element: <RecommendedStoreProducts />,
        },
        {
          path: "/brands",
          element: <Brand />,
        },
        {
          path: "/brandproducts/:id",
          element: <BrandProducts />,
        },
        {
          path: "/b&b",
          element: <Bnb />,
        },
        {
          path: "/b&b-groups",
          element: <BnbGroup />,
        },
        {
          path: "/b&b-groups-products/:id",
          element: <BnbGroupProducts />
        },
        {
          path: "/quick-picks",
          element: <QuickPicksPage />,
        },{
          path: "/quick-pick-groups",
          element: <QuickPickGroupPage />,
        },
        {
          path: "/quick-pick-group/products/:id",
          element: <QuickPickGroupProducts />,
        },
      ],
    },
  ]);

  return (
    <>
      <AdminAuthProvider>
        <ModalsProvider>
          <Notifications position="top-right" zIndex={1000} />
          <Spotlight
            actions={spotlightActions}
            searchProps={{
              placeholder: 'Search...',
              leftSection: <FaSearch size={18} />,
            }}
            shortcut="mod + k"
          />
          <RouterProvider router={router} />
        </ModalsProvider>
      </AdminAuthProvider>
    </>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen mantine-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import Index from "./pages/Index";
import PlaceDetails from "./pages/PlaceDetails";
import EventDetails from "./pages/EventDetails";
import Events from "./pages/Events";
import EventsListings from "./pages/EventsListings";
import Listings from "./pages/Listings";
import CategoryListings from "./pages/CategoryListings";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import NearMe from "./pages/NearMe";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyLoyalty from "./pages/MyLoyalty";
import Shorts from "./pages/Shorts";
import NotFound from "./pages/NotFound";
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessSetup from "./pages/business/BusinessSetup";
import Recommendations from "./pages/Recommendations";
import BusinessManage from "./pages/business/BusinessManage";
import BusinessImages from "./pages/business/BusinessImages";
import BusinessMenu from "./pages/business/BusinessMenu";
import BusinessPromotions from "./pages/business/BusinessPromotions";
import BusinessShorts from "./pages/business/BusinessShorts";
import BusinessLoyalty from "./pages/business/BusinessLoyalty";
import BusinessNotifications from "./pages/business/BusinessNotifications";
import BusinessProximity from "./pages/business/BusinessProximity";
import BusinessSubscription from "./pages/business/BusinessSubscription";
import BusinessAnalytics from "./pages/business/BusinessAnalytics";
import BusinessCustomers from "./pages/business/BusinessCustomers";
import BusinessAIConfig from "./pages/business/BusinessAIConfig";
import BusinessSettings from "./pages/business/BusinessSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBusinesses from "./pages/admin/AdminBusinesses";
import AdminPackages from "./pages/admin/AdminPackages";

function App() {
  return (
    <>
      <RoleBasedRedirect>
        <Routes>
          <Route path="/" element={<Index />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events-all" element={<EventsListings />} />
        <Route path="/listings" element={<CategoryListings />} />
        <Route path="/neighborhoods" element={<Listings />} />
        <Route path="/near-me" element={<NearMe />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-loyalty" element={<MyLoyalty />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/business-setup" element={<BusinessSetup />} />
        <Route path="/business-manage" element={<BusinessManage />} />
        <Route path="/business-images" element={<BusinessImages />} />
         <Route path="/business-menu" element={<BusinessMenu />} />
         <Route path="/business-promotions" element={<BusinessPromotions />} />
         <Route path="/business-shorts" element={<BusinessShorts />} />
             <Route path="/business-loyalty" element={<BusinessLoyalty />} />
             <Route path="/business-notifications" element={<BusinessNotifications />} />
             <Route path="/business-proximity" element={<BusinessProximity />} />
             <Route path="/business-subscription" element={<BusinessSubscription />} />
             <Route path="/business-analytics" element={<BusinessAnalytics />} />
             <Route path="/business-customers" element={<BusinessCustomers />} />
             <Route path="/business-ai-config" element={<BusinessAIConfig />} />
             <Route path="/business-settings" element={<BusinessSettings />} />
             <Route path="/admin" element={<AdminDashboard />} />
             <Route path="/admin/businesses" element={<AdminBusinesses />} />
             <Route path="/admin/packages" element={<AdminPackages />} />
         <Route path="*" element={<NotFound />} />
        </Routes>
      </RoleBasedRedirect>
      <Toaster />
    </>
  );
}

export default App;

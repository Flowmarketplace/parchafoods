import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
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
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
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
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

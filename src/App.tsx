import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingAIChat from "./components/FloatingAIChat";
import Index from "./pages/Index";
import PlaceDetails from "./pages/PlaceDetails";
import EventDetails from "./pages/EventDetails";
import Events from "./pages/Events";
import Listings from "./pages/Listings";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <FloatingAIChat />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/neighborhoods" element={<Listings />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

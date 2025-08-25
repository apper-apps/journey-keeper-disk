import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "@/components/pages/Home";
import TripLayout from "@/components/organisms/TripLayout";
import FlightsAccommodation from "@/components/pages/FlightsAccommodation";
import ToursAttractions from "@/components/pages/ToursAttractions";
import Calendar from "@/components/pages/Calendar";
import Map from "@/components/pages/Map";
import Budget from "@/components/pages/Budget";

function App() {
return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trip/:tripId" element={<TripLayout />}>
            <Route index element={<FlightsAccommodation />} />
            <Route path="flights" element={<FlightsAccommodation />} />
            <Route path="tours" element={<ToursAttractions />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="map" element={<Map />} />
            <Route path="budget" element={<Budget />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
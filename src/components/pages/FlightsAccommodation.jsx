import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FlightCard from "@/components/molecules/FlightCard";
import AccommodationCard from "@/components/molecules/AccommodationCard";
import FlightForm from "@/components/organisms/FlightForm";
import AccommodationForm from "@/components/organisms/AccommodationForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { flightService } from "@/services/api/flightService";
import { accommodationService } from "@/services/api/accommodationService";

const FlightsAccommodation = () => {
  const { trip } = useOutletContext();
  const [flights, setFlights] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [showAccommodationForm, setShowAccommodationForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [editingAccommodation, setEditingAccommodation] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [flightsData, accommodationsData] = await Promise.all([
        flightService.getByTripId(trip.Id),
        accommodationService.getByTripId(trip.Id)
      ]);
      setFlights(flightsData);
      setAccommodations(accommodationsData);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [trip.Id]);

  const handleFlightSaved = () => {
    setShowFlightForm(false);
    setEditingFlight(null);
    loadData();
  };

  const handleAccommodationSaved = () => {
    setShowAccommodationForm(false);
    setEditingAccommodation(null);
    loadData();
  };

  const handleEditFlight = (flight) => {
    setEditingFlight(flight);
    setShowFlightForm(true);
  };

  const handleEditAccommodation = (accommodation) => {
    setEditingAccommodation(accommodation);
    setShowAccommodationForm(true);
  };

  const handleDeleteFlight = async (flightId) => {
    if (window.confirm("Are you sure you want to delete this flight?")) {
      try {
        await flightService.delete(flightId);
        toast.success("Flight deleted successfully!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete flight");
      }
    }
  };

  const handleDeleteAccommodation = async (accommodationId) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      try {
        await accommodationService.delete(accommodationId);
        toast.success("Accommodation deleted successfully!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete accommodation");
      }
    }
  };

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;
return (
    <div className="p-6 pb-24 space-y-8">
      {/* Flights Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Plane" size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Flights</h2>
          </div>
          <Button
            icon="Plus"
            onClick={() => setShowFlightForm(true)}
            size="sm"
          >
            Add Flight
          </Button>
        </div>

        {flights.length === 0 ? (
          <Empty
            icon="Plane"
            title="No flights booked yet"
            description="Add your flight details to keep track of your journey"
            actionLabel="Add Flight"
            onAction={() => setShowFlightForm(true)}
          />
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard
                key={flight.Id}
                flight={flight}
                onEdit={handleEditFlight}
                onDelete={handleDeleteFlight}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accommodations Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building" size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Accommodation</h2>
          </div>
          <Button
            icon="Plus"
            onClick={() => setShowAccommodationForm(true)}
            size="sm"
          >
            Add Hotel
          </Button>
        </div>

        {accommodations.length === 0 ? (
          <Empty
            icon="Building"
            title="No accommodation booked yet"
            description="Add your hotel and accommodation details for your stay"
            actionLabel="Add Accommodation"
            onAction={() => setShowAccommodationForm(true)}
          />
        ) : (
          <div className="space-y-4">
            {accommodations.map((accommodation) => (
              <AccommodationCard
                key={accommodation.Id}
                accommodation={accommodation}
                onEdit={handleEditAccommodation}
                onDelete={handleDeleteAccommodation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Forms */}
      {showFlightForm && (
        <FlightForm
          tripId={trip.Id}
          flight={editingFlight}
          onSave={handleFlightSaved}
          onCancel={() => {
            setShowFlightForm(false);
            setEditingFlight(null);
          }}
        />
      )}

      {showAccommodationForm && (
        <AccommodationForm
          tripId={trip.Id}
          accommodation={editingAccommodation}
          onSave={handleAccommodationSaved}
          onCancel={() => {
            setShowAccommodationForm(false);
            setEditingAccommodation(null);
          }}
        />
      )}
    </div>
  );
};

export default FlightsAccommodation;
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { flightService } from "@/services/api/flightService";
import { accommodationService } from "@/services/api/accommodationService";
import { activityService } from "@/services/api/activityService";

const Map = () => {
  const { trip } = useOutletContext();
  const [viewMode, setViewMode] = useState("journey");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [flights, accommodations, activities] = await Promise.all([
        flightService.getByTripId(trip.Id),
        accommodationService.getByTripId(trip.Id),
        activityService.getByTripId(trip.Id)
      ]);

      const allLocations = [
        ...flights.map(flight => ({
          id: `flight-dep-${flight.Id}`,
          type: "airport",
          name: flight.departureAirport,
          title: `${flight.departureAirport} Airport`,
          subtitle: `Departure - ${flight.airline} ${flight.flightNumber}`,
          date: flight.departureTime,
          icon: "Plane",
          color: "blue"
        })),
        ...flights.map(flight => ({
          id: `flight-arr-${flight.Id}`,
          type: "airport",
          name: flight.arrivalAirport,
          title: `${flight.arrivalAirport} Airport`,
          subtitle: `Arrival - ${flight.airline} ${flight.flightNumber}`,
          date: flight.arrivalTime,
          icon: "Plane",
          color: "blue"
        })),
        ...accommodations.map(acc => ({
          id: `hotel-${acc.Id}`,
          type: "hotel",
          name: acc.name,
          title: acc.name,
          subtitle: acc.location,
          date: acc.checkIn,
          icon: "Building",
          color: "green"
        })),
        ...activities.map(activity => ({
          id: `activity-${activity.Id}`,
          type: "attraction",
          name: activity.name,
          title: activity.name,
          subtitle: activity.location,
          date: activity.date,
          icon: "Camera",
          color: "purple"
        }))
      ];

      // Remove duplicates and sort by date
      const uniqueLocations = allLocations.reduce((acc, location) => {
        const existing = acc.find(l => l.name === location.name && l.type === location.type);
        if (!existing) {
          acc.push(location);
        }
        return acc;
      }, []);

      setLocations(uniqueLocations.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (err) {
      setError("Failed to load map data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, [trip.Id]);

  const renderMapPlaceholder = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20" />
      <div className="text-center z-10">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="Map" size={40} className="text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          In a real implementation, this would show an interactive map with your route, markers for all locations, and navigation features.
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      <div className="absolute top-12 right-8 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      <div className="absolute bottom-8 left-12 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
      <div className="absolute bottom-16 right-6 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
    </div>
  );

  const renderLocationList = () => (
    <div className="bg-white rounded-lg shadow-card">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Trip Locations</h3>
        <p className="text-sm text-gray-600 mt-1">
          {locations.length} locations on your journey
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            className="p-6 hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                location.color === "blue" ? "bg-blue-500" :
                location.color === "green" ? "bg-green-500" :
                "bg-purple-500"
              }`}>
                <ApperIcon name={location.icon} size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{location.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{location.subtitle}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <ApperIcon name="Clock" size={12} className="mr-1" />
                  {new Date(location.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  location.type === "airport" ? "bg-blue-100 text-blue-800" :
                  location.type === "hotel" ? "bg-green-100 text-green-800" :
                  "bg-purple-100 text-purple-800"
                }`}>
                  {location.type}
                </span>
              </div>
            </div>
            {index < locations.length - 1 && (
              <div className="ml-6 mt-4">
                <div className="w-px h-6 bg-gray-200" />
                <ApperIcon name="ArrowDown" size={12} className="text-gray-400 -ml-1.5" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLocations} />;

  return (
<div className="p-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Map" size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold">Trip Map</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "journey" ? "primary" : "outline"}
            onClick={() => setViewMode("journey")}
            size="sm"
          >
            Journey
          </Button>
          <Button
            variant={viewMode === "daily" ? "primary" : "outline"}
            onClick={() => setViewMode("daily")}
            size="sm"
          >
            Daily
          </Button>
        </div>
      </div>

      {locations.length === 0 ? (
        <Empty
          icon="Map"
          title="No locations to display"
          description="Add flights, accommodations, and activities to see them on your trip map"
        />
      ) : (
        <div className="space-y-6">
          {renderMapPlaceholder()}
          {renderLocationList()}
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" size={20} className="text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Interactive Map Features</h4>
                <p className="text-sm text-amber-700 mt-1">
                  In a full implementation, this map would include:
                </p>
                <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Interactive Google Maps integration</li>
                  <li>Route visualization between locations</li>
                  <li>Real-time navigation and directions</li>
                  <li>Location clustering and zoom controls</li>
                  <li>Daily view filtering by date</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
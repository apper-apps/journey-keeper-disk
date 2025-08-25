import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import TripCard from "@/components/molecules/TripCard";
import NewTripForm from "@/components/organisms/NewTripForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { tripService } from "@/services/api/tripService";

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewTripForm, setShowNewTripForm] = useState(false);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await tripService.getAll();
      setTrips(data);
    } catch (err) {
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleNewTrip = () => {
    setShowNewTripForm(true);
  };

  const handleTripSaved = () => {
    setShowNewTripForm(false);
    loadTrips();
  };

  if (loading) return <Loading type="trips" />;
  if (error) return <Error message={error} onRetry={loadTrips} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-display">Journey Keeper</h1>
              <p className="text-white/90 mt-1">Your travel companion</p>
            </div>
            <motion.button
              onClick={handleNewTrip}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="Plus" size={24} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {trips.length === 0 ? (
          <Empty
            icon="Compass"
            title="No trips planned yet"
            description="Start planning your next adventure by creating your first trip"
            actionLabel="Create Trip"
            onAction={handleNewTrip}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => (
              <motion.div
                key={trip.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TripCard trip={trip} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showNewTripForm && (
        <NewTripForm
          onSave={handleTripSaved}
          onCancel={() => setShowNewTripForm(false)}
        />
      )}
    </div>
  );
};

export default Home;
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { tripService } from "@/services/api/tripService";
import ApperIcon from "@/components/ApperIcon";
import TripCard from "@/components/molecules/TripCard";
import NewTripForm from "@/components/organisms/NewTripForm";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [sortedTrips, setSortedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [showNewTripForm, setShowNewTripForm] = useState(false);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tripService.getAll();
      setTrips(data);
    } catch (err) {
      setError("Failed to load trips");
      console.error("Error loading trips:", err);
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (trips.length > 0) {
      const { sortTripsByStatus } = require('@/utils/dateUtils');
      setSortedTrips(sortTripsByStatus(trips));
    } else {
      setSortedTrips([]);
    }
  }, [trips]);

  const handleNewTrip = () => {
    setShowNewTripForm(true);
  };

  const handleTripSaved = async (newTrip) => {
    try {
      await tripService.create(newTrip);
      toast.success("Trip created successfully!");
      setShowNewTripForm(false);
      await loadTrips();
    } catch (err) {
      console.error("Error creating trip:", err);
      toast.error("Failed to create trip");
    }
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
        {sortedTrips.length === 0 ? (
          <Empty
            title="No trips planned yet"
            description="Start planning your next adventure"
            action={{
              label: "Plan Your First Trip",
              onClick: handleNewTrip,
            }}
          />
        ) : (
          <div className="space-y-6">
            {sortedTrips.map((trip, index) => (
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
import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import TripHeader from "@/components/organisms/TripHeader";
import BottomNavigation from "@/components/molecules/BottomNavigation";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { tripService } from "@/services/api/tripService";

const TripLayout = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrip = async () => {
    try {
      setLoading(true);
      setError("");
      const tripData = await tripService.getById(tripId);
      if (tripData) {
        setTrip(tripData);
      } else {
        setError("Trip not found");
      }
    } catch (err) {
      setError("Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTrip} />;
  if (!trip) return <Error message="Trip not found" />;

return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TripHeader trip={trip} />
      <div className="flex-1">
        <Outlet context={{ trip }} />
      </div>
      <BottomNavigation tripId={tripId} />
    </div>
  );
};

export default TripLayout;
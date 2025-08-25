import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ActivityCard from "@/components/molecules/ActivityCard";
import ActivityForm from "@/components/organisms/ActivityForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { activityService } from "@/services/api/activityService";

const ToursAttractions = () => {
  const { trip } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await activityService.getByTripId(trip.Id);
      setActivities(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (err) {
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [trip.Id]);

  const handleActivitySaved = () => {
    setShowActivityForm(false);
    setEditingActivity(null);
    loadActivities();
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setShowActivityForm(true);
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await activityService.delete(activityId);
        toast.success("Activity deleted successfully!");
        loadActivities();
      } catch (error) {
        toast.error("Failed to delete activity");
      }
    }
  };

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadActivities} />;

  return (
<div className="p-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Camera" size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold">Tours & Attractions</h2>
        </div>
        <Button
          icon="Plus"
          onClick={() => setShowActivityForm(true)}
          size="sm"
        >
          Add Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <Empty
          icon="Camera"
          title="No activities planned yet"
          description="Add tours, attractions, and activities to make the most of your trip"
          actionLabel="Add Activity"
          onAction={() => setShowActivityForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.Id}
              activity={activity}
              onEdit={handleEditActivity}
              onDelete={handleDeleteActivity}
            />
          ))}
        </div>
      )}

      {showActivityForm && (
        <ActivityForm
          tripId={trip.Id}
          activity={editingActivity}
          onSave={handleActivitySaved}
          onCancel={() => {
            setShowActivityForm(false);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
};

export default ToursAttractions;
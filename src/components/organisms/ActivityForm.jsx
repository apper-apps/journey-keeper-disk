import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { activityService } from "@/services/api/activityService";

const ActivityForm = ({ tripId, activity, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: activity?.name || "",
    location: activity?.location || "",
    date: activity?.date || "",
    duration: activity?.duration || "",
    cost: activity?.cost || "",
    status: activity?.status || "pending",
    bookingPlatform: activity?.bookingPlatform || "",
    websiteUrl: activity?.websiteUrl || "",
    notes: activity?.notes || ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const activityData = {
        ...formData,
        tripId: tripId,
        cost: parseFloat(formData.cost) || 0
      };

      if (activity) {
        await activityService.update(activity.Id, activityData);
        toast.success("Activity updated successfully!");
      } else {
        await activityService.create(activityData);
        toast.success("Activity added successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error("Failed to save activity");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {activity ? "Edit Activity" : "Add Activity"}
            </h2>
            <Button variant="ghost" onClick={onCancel}>
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Activity Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Venue or address"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <FormField
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 2 hours, 1 day"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "booked", label: "Booked" },
                  { value: "paid", label: "Paid" }
                ]}
                required
              />
            </div>

            <FormField
              label="Booking Platform"
              name="bookingPlatform"
              value={formData.bookingPlatform}
              onChange={handleChange}
              placeholder="e.g., GetYourGuide, Viator, Direct"
            />

            <FormField
              label="Website URL"
              name="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://..."
            />

            <FormField
              label="Notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Special instructions, meeting points, etc."
              rows={3}
            />

            <div className="flex space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Saving..." : activity ? "Update Activity" : "Add Activity"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivityForm;
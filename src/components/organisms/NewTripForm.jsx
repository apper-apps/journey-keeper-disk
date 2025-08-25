import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { tripService } from "@/services/api/tripService";

const NewTripForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    totalBudget: "",
    coverImage: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const tripData = {
        ...formData,
        totalBudget: parseFloat(formData.totalBudget) || 0,
        coverImage: formData.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"
      };

      await tripService.create(tripData);
      toast.success("Trip created successfully!");
      onSave();
    } catch (error) {
      toast.error("Failed to create trip");
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
            <h2 className="text-xl font-bold">Create New Trip</h2>
            <Button variant="ghost" onClick={onCancel}>
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Trip Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., European Adventure 2024"
              required
            />

            <FormField
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., Paris, France"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <FormField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <FormField
              label="Total Budget"
              name="totalBudget"
              type="number"
              value={formData.totalBudget}
              onChange={handleChange}
              placeholder="0.00"
              required
            />

            <FormField
              label="Cover Image URL"
              name="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://... (optional)"
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
                {loading ? "Creating..." : "Create Trip"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewTripForm;
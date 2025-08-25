import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { accommodationService } from "@/services/api/accommodationService";
import { calculateNights } from "@/utils/dateUtils";

const AccommodationForm = ({ tripId, accommodation, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: accommodation?.name || "",
    location: accommodation?.location || "",
    checkIn: accommodation?.checkIn?.slice(0, 16) || "",
    checkOut: accommodation?.checkOut?.slice(0, 16) || "",
    cost: accommodation?.cost || "",
    status: accommodation?.status || "pending",
    bookingPlatform: accommodation?.bookingPlatform || "",
    bookingReference: accommodation?.bookingReference || "",
    websiteUrl: accommodation?.websiteUrl || ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      
      const accommodationData = {
        ...formData,
        tripId: tripId,
        cost: parseFloat(formData.cost) || 0,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        nights: calculateNights(checkInDate, checkOutDate)
      };

      if (accommodation) {
        await accommodationService.update(accommodation.Id, accommodationData);
        toast.success("Accommodation updated successfully!");
      } else {
        await accommodationService.create(accommodationData);
        toast.success("Accommodation added successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error("Failed to save accommodation");
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
              {accommodation ? "Edit Accommodation" : "Add Accommodation"}
            </h2>
            <Button variant="ghost" onClick={onCancel}>
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Hotel/Property Name"
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
              placeholder="City, Area"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Check-in"
                name="checkIn"
                type="datetime-local"
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
              <FormField
                label="Check-out"
                name="checkOut"
                type="datetime-local"
                value={formData.checkOut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Total Cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                required
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
              placeholder="e.g., Booking.com, Airbnb"
            />

            <FormField
              label="Booking Reference"
              name="bookingReference"
              value={formData.bookingReference}
              onChange={handleChange}
              placeholder="Confirmation code"
            />

            <FormField
              label="Website URL"
              name="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://..."
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
                {loading ? "Saving..." : accommodation ? "Update Accommodation" : "Add Accommodation"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccommodationForm;
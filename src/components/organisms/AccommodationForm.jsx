import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { accommodationService } from "@/services/api/accommodationService";
import { calculateNights } from "@/utils/dateUtils";
import { cities } from "@/components/atoms/MultiSelect";

const AccommodationForm = ({ tripId, accommodation, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    name: accommodation?.name || "",
    location: accommodation?.location || "",
    checkInDate: accommodation?.checkIn ? accommodation.checkIn.slice(0, 10) : "",
    checkInTime: accommodation?.checkIn ? accommodation.checkIn.slice(11, 16) : "",
    checkOutDate: accommodation?.checkOut ? accommodation.checkOut.slice(0, 10) : "",
    checkOutTime: accommodation?.checkOut ? accommodation.checkOut.slice(11, 16) : "",
    cost: accommodation?.cost || "",
    status: accommodation?.status || "pending",
    bookingPlatform: accommodation?.bookingPlatform || "",
    bookingReference: accommodation?.bookingReference || "",
    websiteUrl: accommodation?.websiteUrl || ""
  });

  const hotelSuggestions = [
    "Marriott", "Hilton", "Hyatt", "InterContinental", "Four Seasons", "Ritz-Carlton", "Sheraton", 
    "Westin", "W Hotel", "Renaissance", "Courtyard by Marriott", "Hampton Inn", "Holiday Inn",
    "Crowne Plaza", "Radisson", "Best Western", "Accor", "Novotel", "Ibis", "Sofitel",
    "Le Meridien", "JW Marriott", "St. Regis", "Luxury Collection", "Autograph Collection",
    "Kimpton", "Thompson Hotels", "1 Hotels", "Edition Hotels", "Aman Hotels"
  ];

  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Combine date and time for check-in
      const checkInDateTime = formData.checkInTime 
        ? `${formData.checkInDate}T${formData.checkInTime}:00`
        : `${formData.checkInDate}T15:00:00`; // Default 3 PM
      
      // Combine date and time for check-out  
      const checkOutDateTime = formData.checkOutTime
        ? `${formData.checkOutDate}T${formData.checkOutTime}:00`
        : `${formData.checkOutDate}T11:00:00`; // Default 11 AM
      
      const checkInDate = new Date(checkInDateTime);
      const checkOutDate = new Date(checkOutDateTime);
      
      const accommodationData = {
        name: formData.name,
        location: formData.location,
        cost: parseFloat(formData.cost) || 0,
        status: formData.status,
        bookingPlatform: formData.bookingPlatform,
        bookingReference: formData.bookingReference,
        websiteUrl: formData.websiteUrl,
        tripId: tripId,
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
      console.error("Save error:", error);
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

<form onSubmit={handleSubmit} className="space-y-4 pb-8">
            <FormField
              label="Hotel/Property Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              suggestions={hotelSuggestions}
              placeholder="e.g., Marriott, Hilton, or enter custom name"
              required
            />

            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              suggestions={cities}
              placeholder="City, Area"
              required
            />

<div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Check-in Date"
                  name="checkInDate"
                  type="date"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Check-out Date"
                  name="checkOutDate"
                  type="date"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Check-in Time (Optional)"
                  name="checkInTime"
                  type="time"
                  value={formData.checkInTime}
                  onChange={handleChange}
                  placeholder="Default: 3:00 PM"
                />
                <FormField
                  label="Check-out Time (Optional)"
                  name="checkOutTime"
                  type="time"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                  placeholder="Default: 11:00 AM"
                />
              </div>
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
<div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-6 mb-8 -mx-6 px-6 pb-8">
              <div className="flex space-x-3">
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
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccommodationForm;
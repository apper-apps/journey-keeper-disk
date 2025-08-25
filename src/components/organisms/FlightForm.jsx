import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { flightService } from "@/services/api/flightService";

const FlightForm = ({ tripId, flight, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    airline: flight?.airline || "",
    flightNumber: flight?.flightNumber || "",
    departureAirport: flight?.departureAirport || "",
    arrivalAirport: flight?.arrivalAirport || "",
    departureTime: flight?.departureTime?.slice(0, 16) || "",
    arrivalTime: flight?.arrivalTime?.slice(0, 16) || "",
    cost: flight?.cost || "",
    status: flight?.status || "pending",
    luggageAllowance: flight?.luggageAllowance || "",
    bookingReference: flight?.bookingReference || ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const flightData = {
        ...formData,
        tripId: tripId,
        cost: parseFloat(formData.cost) || 0,
        departureTime: new Date(formData.departureTime).toISOString(),
        arrivalTime: new Date(formData.arrivalTime).toISOString()
      };

      if (flight) {
        await flightService.update(flight.Id, flightData);
        toast.success("Flight updated successfully!");
      } else {
        await flightService.create(flightData);
        toast.success("Flight added successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error("Failed to save flight");
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
              {flight ? "Edit Flight" : "Add Flight"}
            </h2>
            <Button variant="ghost" onClick={onCancel}>
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Airline"
                name="airline"
                value={formData.airline}
                onChange={handleChange}
                required
              />
              <FormField
                label="Flight Number"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Departure Airport"
                name="departureAirport"
                value={formData.departureAirport}
                onChange={handleChange}
                placeholder="e.g., JFK"
                required
              />
              <FormField
                label="Arrival Airport"
                name="arrivalAirport"
                value={formData.arrivalAirport}
                onChange={handleChange}
                placeholder="e.g., CDG"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Departure Time"
                name="departureTime"
                type="datetime-local"
                value={formData.departureTime}
                onChange={handleChange}
                required
              />
              <FormField
                label="Arrival Time"
                name="arrivalTime"
                type="datetime-local"
                value={formData.arrivalTime}
                onChange={handleChange}
                required
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
              label="Luggage Allowance"
              name="luggageAllowance"
              value={formData.luggageAllowance}
              onChange={handleChange}
              placeholder="e.g., 2 checked bags"
            />

            <FormField
              label="Booking Reference"
              name="bookingReference"
              value={formData.bookingReference}
              onChange={handleChange}
              placeholder="Confirmation code"
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
                {loading ? "Saving..." : flight ? "Update Flight" : "Add Flight"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FlightForm;
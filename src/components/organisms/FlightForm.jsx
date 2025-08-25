import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { flightService } from "@/services/api/flightService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FlightForm = ({ tripId, flight, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    airline: flight?.airline || "",
    flightNumber: flight?.flightNumber || "",
    departureAirport: flight?.departureAirport || "",
    arrivalAirport: flight?.arrivalAirport || "",
    departureDate: flight?.departureTime ? flight.departureTime.slice(0, 10) : "",
    departureTime: flight?.departureTime ? flight.departureTime.slice(11, 16) : "",
    arrivalDate: flight?.arrivalTime ? flight.arrivalTime.slice(0, 10) : "",
    arrivalTime: flight?.arrivalTime ? flight.arrivalTime.slice(11, 16) : "",
    cost: flight?.cost || "",
    status: flight?.status || "pending",
    luggageAllowance: flight?.luggageAllowance || "",
    bookingReference: flight?.bookingReference || ""
  });

const [loading, setLoading] = useState(false);
  const [airlineSuggestions, setAirlineSuggestions] = useState([]);
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [showAirlineSuggestions, setShowAirlineSuggestions] = useState(false);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);
  const [lookingUpFlight, setLookingUpFlight] = useState(false);

  useEffect(() => {
    if (formData.flightNumber && formData.departureDate && formData.flightNumber.length >= 2) {
      handleFlightLookup();
    }
  }, [formData.flightNumber, formData.departureDate]);
const handleFlightLookup = async () => {
    if (!formData.flightNumber || !formData.departureDate || formData.flightNumber.length < 2) return;
    
    try {
      setLookingUpFlight(true);
      const flightInfo = await flightService.lookupFlight(formData.flightNumber, formData.departureDate);
      if (flightInfo) {
        setFormData(prev => ({
          ...prev,
          airline: flightInfo.airline || prev.airline,
          departureAirport: flightInfo.departureAirport || prev.departureAirport,
          arrivalAirport: flightInfo.arrivalAirport || prev.arrivalAirport,
          departureTime: flightInfo.departureTime || prev.departureTime,
          arrivalTime: flightInfo.arrivalTime || prev.arrivalTime
        }));
        toast.success("Flight details found and populated!");
      }
    } catch (error) {
      // Silent fail for lookup
    } finally {
      setLookingUpFlight(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const departureDateTime = `${formData.departureDate}T${formData.departureTime}:00`;
      const arrivalDateTime = `${formData.arrivalDate}T${formData.arrivalTime}:00`;
      
      const flightData = {
        ...formData,
        tripId: tripId,
        cost: parseFloat(formData.cost) || 0,
        departureTime: new Date(departureDateTime).toISOString(),
        arrivalTime: new Date(arrivalDateTime).toISOString()
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

  const handleAirlineSearch = async (value) => {
    setFormData(prev => ({ ...prev, airline: value }));
    if (value.length >= 2) {
      const suggestions = await flightService.getAirlineSuggestions(value);
      setAirlineSuggestions(suggestions);
      setShowAirlineSuggestions(true);
    } else {
      setShowAirlineSuggestions(false);
    }
  };

  const handleAirportSearch = async (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (value.length >= 2) {
      const suggestions = await flightService.getAirportSuggestions(value);
      setAirportSuggestions(suggestions);
      if (field === 'departureAirport') {
        setShowDepartureSuggestions(true);
      } else {
        setShowArrivalSuggestions(true);
      }
    } else {
      setShowDepartureSuggestions(false);
      setShowArrivalSuggestions(false);
    }
  };

  const selectSuggestion = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setShowAirlineSuggestions(false);
    setShowDepartureSuggestions(false);
    setShowArrivalSuggestions(false);
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
              <FormField label="Airline" required>
                <div className="relative">
                  <input
                    type="text"
                    name="airline"
                    value={formData.airline}
                    onChange={(e) => handleAirlineSearch(e.target.value)}
                    className="input-field"
                    placeholder="e.g., Air France, Delta"
                    required
                  />
                  {showAirlineSuggestions && airlineSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {airlineSuggestions.map((airline, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                          onClick={() => selectSuggestion(airline, 'airline')}
                        >
                          {airline}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
              
              <FormField label="Flight Number" required>
                <div className="relative">
                  <input
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., AF83, DL123"
                    required
                  />
                  {lookingUpFlight && (
                    <div className="absolute right-3 top-3">
                      <ApperIcon name="Loader" size={16} className="animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
              </FormField>
            </div>

<div className="grid grid-cols-2 gap-4">
              <FormField label="Departure Airport" required>
                <div className="relative">
                  <input
                    type="text"
                    name="departureAirport"
                    value={formData.departureAirport}
                    onChange={(e) => handleAirportSearch(e.target.value, 'departureAirport')}
                    className="input-field"
                    placeholder="e.g., JFK, LAX"
                    required
                  />
                  {showDepartureSuggestions && airportSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {airportSuggestions.map((airport, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                          onClick={() => selectSuggestion(airport.code, 'departureAirport')}
                        >
                          <div className="font-medium">{airport.code}</div>
                          <div className="text-sm text-gray-600">{airport.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
              
              <FormField label="Arrival Airport" required>
                <div className="relative">
                  <input
                    type="text"
                    name="arrivalAirport"
                    value={formData.arrivalAirport}
                    onChange={(e) => handleAirportSearch(e.target.value, 'arrivalAirport')}
                    className="input-field"
                    placeholder="e.g., CDG, NRT"
                    required
                  />
                  {showArrivalSuggestions && airportSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {airportSuggestions.map((airport, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                          onClick={() => selectSuggestion(airport.code, 'arrivalAirport')}
                        >
                          <div className="font-medium">{airport.code}</div>
                          <div className="text-sm text-gray-600">{airport.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
            </div>

<div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Departure Date"
                  name="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Departure Time"
                  name="departureTime"
                  type="time"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Arrival Date"
                  name="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Arrival Time"
                  name="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                />
              </div>
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
                {loading ? "Saving..." : "Save Flight"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FlightForm;
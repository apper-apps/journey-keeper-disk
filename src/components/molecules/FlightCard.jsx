import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatDateTime, formatTime } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";

const FlightCard = ({ flight, onEdit, onDelete }) => {
  return (
    <motion.div
      className="card p-6 hover:shadow-lg transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Plane" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
            <p className="text-sm text-gray-600">{flight.flightNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge status={flight.status}>{flight.status}</Badge>
          <button
            onClick={() => onEdit(flight)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onDelete(flight.Id)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="font-bold text-2xl text-gray-900">{flight.departureAirport}</p>
            <p className="text-sm text-gray-600">{formatTime(flight.departureTime)}</p>
          </div>
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full border-t-2 border-dashed border-gray-300 relative">
              <ApperIcon 
                name="Plane" 
                size={20} 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500 bg-white" 
              />
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-2xl text-gray-900">{flight.arrivalAirport}</p>
            <p className="text-sm text-gray-600">{formatTime(flight.arrivalTime)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Departure</p>
            <p className="text-sm font-medium">{formatDateTime(flight.departureTime)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Arrival</p>
            <p className="text-sm font-medium">{formatDateTime(flight.arrivalTime)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-xs text-gray-500">Luggage</p>
              <p className="text-sm font-medium">{flight.luggageAllowance}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reference</p>
              <p className="text-sm font-medium">{flight.bookingReference}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Cost</p>
            <p className="text-lg font-bold text-primary-600">{formatCurrency(flight.cost)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
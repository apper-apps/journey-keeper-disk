import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from "react";
import { formatCurrency, getStatusColor } from "@/utils/formatUtils";
import { formatDate, getTripDuration, getTripStatus } from "@/utils/dateUtils";
import ApperIcon from "@/components/ApperIcon";
import Budget from "@/components/pages/Budget";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "Current Trip":
        return "bg-green-100 text-green-800 border-green-200";
      case "Active Trip":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Future Trip":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Past Trip":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleClick = () => {
    navigate(`/trip/${trip.Id}/calendar`);
  };

  const duration = getTripDuration(trip.startDate, trip.endDate);
  const budgetUsed = trip.actualSpent > 0 
    ? ((trip.actualSpent / trip.totalBudget) * 100).toFixed(0)
    : 0;
const tripStatus = getTripStatus(trip.startDate, trip.endDate);

  return (
    <motion.div
      className="card-premium cursor-pointer group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tripStatus)}`}>
            {tripStatus}
          </span>
        </div>
        
        {/* Trip info overlay */}
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold font-display">{trip.name}</h3>
          <p className="text-white/90 flex items-center">
            <ApperIcon name="MapPin" size={14} className="mr-1" />
            {trip.destination}
          </p>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            <span className="text-sm">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {duration} {duration === 1 ? "day" : "days"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="font-semibold text-lg">
              {formatCurrency(trip.actualSpent)} / {formatCurrency(trip.totalBudget)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress</p>
            <div className="flex items-center space-x-2">
<div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(budgetUsed)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
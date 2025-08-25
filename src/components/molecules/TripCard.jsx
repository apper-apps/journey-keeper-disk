import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { formatDate, getTripDuration } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const duration = getTripDuration(trip.startDate, trip.endDate);
  const budgetProgress = trip.totalBudget > 0 ? (trip.actualSpent / trip.totalBudget) * 100 : 0;

  return (
    <motion.div
      className="card-premium cursor-pointer hover:shadow-premium transition-all duration-300"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/trip/${trip.Id}`)}
    >
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${trip.coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
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
                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(budgetProgress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { formatDate, getTripDuration } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";

const TripHeader = ({ trip }) => {
  const navigate = useNavigate();
  const duration = getTripDuration(trip.startDate, trip.endDate);
  const budgetProgress = trip.totalBudget > 0 ? (trip.actualSpent / trip.totalBudget) * 100 : 0;

  return (
    <motion.div
      className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={24} />
          </button>
          <h1 className="text-xl font-bold font-display text-center flex-1">
            {trip.name}
          </h1>
          <div className="w-10" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <ApperIcon name="MapPin" size={16} className="mr-2" />
            <span className="text-lg">{trip.destination}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wide">Duration</p>
              <p className="font-semibold">
                {duration} {duration === 1 ? "day" : "days"}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wide">Dates</p>
              <p className="font-semibold text-sm">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wide">Budget</p>
              <p className="font-semibold">
                {formatCurrency(trip.actualSpent)} / {formatCurrency(trip.totalBudget)}
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripHeader;
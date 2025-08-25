import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatDateTime } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";

const AccommodationCard = ({ accommodation, onEdit, onDelete }) => {
  return (
    <motion.div
      className="card p-6 hover:shadow-lg transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Building" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{accommodation.name}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <ApperIcon name="MapPin" size={14} className="mr-1" />
              {accommodation.location}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge status={accommodation.status}>{accommodation.status}</Badge>
          <button
            onClick={() => onEdit(accommodation)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onDelete(accommodation.Id)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Check-in</p>
            <p className="text-sm font-medium">{formatDateTime(accommodation.checkIn)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Check-out</p>
            <p className="text-sm font-medium">{formatDateTime(accommodation.checkOut)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-xs text-gray-500">Nights</p>
              <p className="text-sm font-medium">{accommodation.nights}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Platform</p>
              <p className="text-sm font-medium">{accommodation.bookingPlatform}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reference</p>
              <p className="text-sm font-medium">{accommodation.bookingReference}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Cost</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(accommodation.cost)}</p>
          </div>
        </div>

        {accommodation.websiteUrl && (
          <div className="pt-2">
            <a
              href={accommodation.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <ApperIcon name="ExternalLink" size={14} className="mr-1" />
              View booking
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AccommodationCard;
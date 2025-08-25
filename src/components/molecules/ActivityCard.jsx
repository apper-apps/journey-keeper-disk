import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatDate } from "@/utils/dateUtils";
import { formatCurrency, formatDuration } from "@/utils/formatUtils";

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  return (
    <motion.div
      className="card p-6 hover:shadow-lg transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Camera" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{activity.name}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <ApperIcon name="MapPin" size={14} className="mr-1" />
              {activity.location}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge status={activity.status}>{activity.status}</Badge>
          <button
            onClick={() => onEdit(activity)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onDelete(activity.Id)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
            <p className="text-sm font-medium">{formatDate(activity.date)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
            <p className="text-sm font-medium">{formatDuration(activity.duration)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-xs text-gray-500">Platform</p>
              <p className="text-sm font-medium">{activity.bookingPlatform}</p>
            </div>
            {activity.cost > 0 && (
              <div>
                <p className="text-xs text-gray-500">Cost</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(activity.cost)}</p>
              </div>
            )}
          </div>
        </div>

        {activity.notes && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-gray-700">{activity.notes}</p>
          </div>
        )}

        {activity.websiteUrl && (
          <div className="pt-2">
            <a
              href={activity.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <ApperIcon name="ExternalLink" size={14} className="mr-1" />
              View details
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ActivityCard;
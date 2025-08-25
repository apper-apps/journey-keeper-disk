import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Compass",
  title = "Nothing here yet",
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default Empty;
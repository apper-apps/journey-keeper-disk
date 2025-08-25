import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { budgetService } from "@/services/api/budgetService";
import { flightService } from "@/services/api/flightService";
import { accommodationService } from "@/services/api/accommodationService";
import { activityService } from "@/services/api/activityService";
import { formatCurrency } from "@/utils/formatUtils";

const Budget = () => {
  const { trip } = useOutletContext();
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    totalEstimated: 0,
    totalActual: 0,
    totalPaid: 0,
    byCategory: {}
  });

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [budgetData, flights, accommodations, activities] = await Promise.all([
        budgetService.getByTripId(trip.Id),
        flightService.getByTripId(trip.Id),
        accommodationService.getByTripId(trip.Id),
        activityService.getByTripId(trip.Id)
      ]);

      // Combine all budget items from different sources
      const allBudgetItems = [
        ...budgetData,
        ...flights.map(flight => ({
          Id: `flight-${flight.Id}`,
          category: "flights",
          description: `${flight.airline} ${flight.flightNumber}`,
          estimatedCost: flight.cost,
          actualCost: flight.cost,
          isPaid: flight.status === "paid",
          date: flight.departureTime
        })),
        ...accommodations.map(acc => ({
          Id: `accommodation-${acc.Id}`,
          category: "accommodation",
          description: acc.name,
          estimatedCost: acc.cost,
          actualCost: acc.cost,
          isPaid: acc.status === "paid",
          date: acc.checkIn
        })),
        ...activities.map(activity => ({
          Id: `activity-${activity.Id}`,
          category: "activities",
          description: activity.name,
          estimatedCost: activity.cost,
          actualCost: activity.cost,
          isPaid: activity.status === "paid",
          date: activity.date
        }))
      ];

      setBudgetItems(allBudgetItems);
      calculateSummary(allBudgetItems);
    } catch (err) {
      setError("Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (items) => {
    const totalEstimated = items.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
    const totalActual = items.reduce((sum, item) => sum + (item.actualCost || 0), 0);
    const totalPaid = items.filter(item => item.isPaid).reduce((sum, item) => sum + (item.actualCost || 0), 0);

    const byCategory = items.reduce((acc, item) => {
      const category = item.category || "miscellaneous";
      if (!acc[category]) {
        acc[category] = {
          estimated: 0,
          actual: 0,
          paid: 0,
          count: 0
        };
      }
      acc[category].estimated += item.estimatedCost || 0;
      acc[category].actual += item.actualCost || 0;
      if (item.isPaid) {
        acc[category].paid += item.actualCost || 0;
      }
      acc[category].count += 1;
      return acc;
    }, {});

    setSummary({
      totalEstimated,
      totalActual,
      totalPaid,
      byCategory
    });
  };

  useEffect(() => {
    loadBudgetData();
  }, [trip.Id]);

  const getCategoryIcon = (category) => {
    const iconMap = {
      flights: "Plane",
      accommodation: "Building",
      activities: "Camera",
      food: "Utensils",
      transport: "Car",
      miscellaneous: "Package"
    };
    return iconMap[category] || "Package";
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      flights: "blue",
      accommodation: "green",
      activities: "purple",
      food: "orange",
      transport: "gray",
      miscellaneous: "indigo"
    };
    return colorMap[category] || "gray";
  };

  const renderProgressRing = (current, total, size = 80) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    const circumference = 2 * Math.PI * 30;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r="30"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="30"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-primary-600 transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBudgetData} />;

return (
    <div className="p-6 pb-24 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <ApperIcon name="DollarSign" size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-bold">Budget Overview</h2>
      </div>

      {budgetItems.length === 0 ? (
        <Empty
          icon="DollarSign"
          title="No budget items yet"
          description="Your budget will automatically populate as you add flights, accommodation, and activities"
        />
      ) : (
        <div className="space-y-6">
          {/* Budget Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100">Total Budget</p>
                  <p className="text-2xl font-bold">{formatCurrency(trip.totalBudget)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" size={24} />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Spent</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalActual)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={24} />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-6 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Remaining</p>
                  <p className={`text-2xl font-bold ${
                    trip.totalBudget - summary.totalActual >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {formatCurrency(trip.totalBudget - summary.totalActual)}
                  </p>
                </div>
                {renderProgressRing(summary.totalActual, trip.totalBudget, 60)}
              </div>
            </motion.div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-card">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Spending by Category</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(summary.byCategory).map(([category, data]) => (
                  <motion.div
                    key={category}
                    className="p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${getCategoryColor(category)}-500`}>
                        <ApperIcon name={getCategoryIcon(category)} size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium capitalize">{category}</h4>
                        <p className="text-sm text-gray-600">{data.count} items</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Actual:</span>
                        <span className="font-medium">{formatCurrency(data.actual)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Paid:</span>
                        <span className="font-medium text-green-600">{formatCurrency(data.paid)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Items List */}
          <div className="bg-white rounded-lg shadow-card">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">All Budget Items</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {budgetItems.map((item, index) => (
                <motion.div
                  key={item.Id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${getCategoryColor(item.category)}-500`}>
                        <ApperIcon name={getCategoryIcon(item.category)} size={18} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.description}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge
                            variant={item.category}
                            className="capitalize"
                          >
                            {item.category}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(item.actualCost)}</p>
                      <Badge status={item.isPaid ? "paid" : "pending"}>
                        {item.isPaid ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = ({ tripId }) => {
  const navItems = [
    { id: "flights", label: "Flights", icon: "Plane", path: `/trip/${tripId}/flights` },
    { id: "tours", label: "Tours", icon: "Camera", path: `/trip/${tripId}/tours` },
    { id: "calendar", label: "Calendar", icon: "Calendar", path: `/trip/${tripId}/calendar` },
    { id: "map", label: "Map", icon: "Map", path: `/trip/${tripId}/map` },
    { id: "budget", label: "Budget", icon: "DollarSign", path: `/trip/${tripId}/budget` }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;
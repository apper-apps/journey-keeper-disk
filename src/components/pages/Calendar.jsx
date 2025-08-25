import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfWeek, endOfWeek } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { flightService } from "@/services/api/flightService";
import { accommodationService } from "@/services/api/accommodationService";
import { activityService } from "@/services/api/activityService";
import { formatTime } from "@/utils/dateUtils";

const Calendar = () => {
  const { trip } = useOutletContext();
  const [viewMode, setViewMode] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [flights, accommodations, activities] = await Promise.all([
        flightService.getByTripId(trip.Id),
        accommodationService.getByTripId(trip.Id),
        activityService.getByTripId(trip.Id)
      ]);

      const allEvents = [
        ...flights.map(flight => ({
          id: `flight-${flight.Id}`,
          type: "flight",
          title: `${flight.airline} ${flight.flightNumber}`,
          subtitle: `${flight.departureAirport} → ${flight.arrivalAirport}`,
          date: flight.departureTime,
          time: formatTime(flight.departureTime),
          icon: "Plane",
          color: "blue"
        })),
        ...accommodations.map(acc => ({
          id: `checkin-${acc.Id}`,
          type: "accommodation",
          title: `Check-in: ${acc.name}`,
          subtitle: acc.location,
          date: acc.checkIn,
          time: formatTime(acc.checkIn),
          icon: "Building",
          color: "green"
        })),
        ...accommodations.map(acc => ({
          id: `checkout-${acc.Id}`,
          type: "accommodation",
          title: `Check-out: ${acc.name}`,
          subtitle: acc.location,
          date: acc.checkOut,
          time: formatTime(acc.checkOut),
          icon: "Building",
          color: "green"
        })),
        ...activities.map(activity => ({
          id: `activity-${activity.Id}`,
          type: "activity",
          title: activity.name,
          subtitle: activity.location,
          date: activity.date,
          time: "All day",
          icon: "Camera",
          color: "purple"
        }))
      ];

      setEvents(allEvents.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (err) {
      setError("Failed to load calendar events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [trip.Id]);

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] p-2 border-b border-r border-gray-100 ${
                  !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? "text-primary-600" : ""
                }`}>
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${
                        event.color === "blue" ? "bg-blue-100 text-blue-800" :
                        event.color === "green" ? "bg-green-100 text-green-800" :
                        "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow-card">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold">
            {format(currentDate, "EEEE, MMMM d, yyyy")}
          </h3>
        </div>
        <div className="p-6">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events scheduled for this day
            </div>
          ) : (
            <div className="space-y-4">
              {dayEvents.map(event => (
                <motion.div
                  key={event.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.color === "blue" ? "bg-blue-500" :
                    event.color === "green" ? "bg-green-500" :
                    "bg-purple-500"
                  }`}>
                    <ApperIcon name={event.icon} size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.subtitle}</p>
                    <p className="text-sm text-gray-500 mt-1">{event.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEvents} />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Calendar" size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold">Calendar</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "day" ? "primary" : "outline"}
            onClick={() => setViewMode("day")}
            size="sm"
          >
            Day
          </Button>
          <Button
            variant={viewMode === "month" ? "primary" : "outline"}
            onClick={() => setViewMode("month")}
            size="sm"
          >
            Month
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            if (viewMode === "month") {
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
            } else {
              setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
            }
          }}
          icon="ChevronLeft"
        />
        <h3 className="text-lg font-semibold">
          {viewMode === "month" 
            ? format(currentDate, "MMMM yyyy")
            : format(currentDate, "EEEE, MMMM d, yyyy")
          }
        </h3>
        <Button
          variant="ghost"
          onClick={() => {
            if (viewMode === "month") {
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
            } else {
              setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
            }
          }}
          icon="ChevronRight"
        />
      </div>

      {events.length === 0 ? (
        <Empty
          icon="Calendar"
          title="No events scheduled yet"
          description="Add flights, accommodations, and activities to see them in your calendar"
        />
      ) : (
        viewMode === "month" ? renderMonthView() : renderDayView()
      )}
    </div>
  );
};

export default Calendar;
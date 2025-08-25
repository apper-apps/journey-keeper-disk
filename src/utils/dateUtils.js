import { format, parseISO, differenceInDays, addDays } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy");
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  const dateObj = typeof dateTime === "string" ? parseISO(dateTime) : dateTime;
  return format(dateObj, "MMM dd, yyyy 'at' h:mm a");
};

export const formatTime = (dateTime) => {
  if (!dateTime) return "";
  const dateObj = typeof dateTime === "string" ? parseISO(dateTime) : dateTime;
  return format(dateObj, "h:mm a");
};

export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const checkInDate = typeof checkIn === "string" ? parseISO(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === "string" ? parseISO(checkOut) : checkOut;
  return differenceInDays(checkOutDate, checkInDate);
};

export const getTripDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
  return differenceInDays(end, start) + 1;
};

export const getTripStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return "Future Trip";
  
  const today = new Date();
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
  
  // Current trip - today is between start and end dates
  if (today >= start && today <= end) {
    return "Current Trip";
  }
  
  // Past trip - end date has passed
  if (today > end) {
    return "Past Trip";
  }
  
  // Active trip - start date within next 6 months
  const sixMonthsFromNow = addDays(today, 180);
  if (start <= sixMonthsFromNow) {
    return "Active Trip";
  }
  
  // Future trip - start date more than 6 months away
  return "Future Trip";
};

export const sortTripsByStatus = (trips) => {
  const today = new Date();
export const formatTimeForInput = (dateString) => {
  if (!dateString) return "";
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'HH:mm');
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'yyyy-MM-dd');
};

export const combineDateAndTime = (dateString, timeString) => {
  if (!dateString || !timeString) return null;
  return new Date(`${dateString}T${timeString}:00`);
};
  return [...trips].sort((a, b) => {
    const statusA = getTripStatus(a.startDate, a.endDate);
    const statusB = getTripStatus(b.startDate, b.endDate);
    const startA = typeof a.startDate === "string" ? parseISO(a.startDate) : a.startDate;
    const startB = typeof b.startDate === "string" ? parseISO(b.startDate) : b.startDate;
    const endA = typeof a.endDate === "string" ? parseISO(a.endDate) : a.endDate;
    const endB = typeof b.endDate === "string" ? parseISO(b.endDate) : b.endDate;
    
    // Priority order: Current -> Active -> Future -> Past
    const statusPriority = {
      "Current Trip": 1,
      "Active Trip": 2,
      "Future Trip": 3,
      "Past Trip": 4
    };
    
    if (statusPriority[statusA] !== statusPriority[statusB]) {
      return statusPriority[statusA] - statusPriority[statusB];
    }
    
    // Same status, sort by date
    if (statusA === "Active Trip" || statusA === "Future Trip") {
      return startA - startB; // Soonest first
    } else if (statusA === "Past Trip") {
      return endB - endA; // Most recent first
    }
    
    return 0; // Current trips maintain original order
  });
};
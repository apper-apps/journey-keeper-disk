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
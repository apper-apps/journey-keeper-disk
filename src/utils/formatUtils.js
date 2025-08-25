export const formatCurrency = (amount, currency = "USD") => {
  if (amount == null) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDuration = (duration) => {
  if (!duration) return "";
  
  // Handle different duration formats
  if (duration.includes("hour")) {
    return duration;
  } else if (duration.includes("day")) {
    return duration;
  } else {
    // Assume it's in hours if just a number
    const num = parseInt(duration);
    if (isNaN(num)) return duration;
    return num === 1 ? "1 hour" : `${num} hours`;
  }
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "booked":
      return "status-booked";
    case "paid":
      return "status-paid";
    case "pending":
    default:
      return "status-pending";
  }
};
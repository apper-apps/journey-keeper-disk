import flightsData from "@/services/mockData/flights.json";

let flights = [...flightsData];

export const flightService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...flights];
  },

  getByTripId: async (tripId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return flights.filter(flight => flight.tripId === tripId.toString());
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return flights.find(flight => flight.Id === parseInt(id));
  },

  create: async (flightData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = flights.length > 0 ? Math.max(...flights.map(f => f.Id)) : 0;
    const newFlight = {
      Id: maxId + 1,
      ...flightData,
      status: flightData.status || "pending"
    };
    flights.push(newFlight);
    return { ...newFlight };
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = flights.findIndex(flight => flight.Id === parseInt(id));
    if (index !== -1) {
      flights[index] = { ...flights[index], ...updates };
      return { ...flights[index] };
    }
    throw new Error("Flight not found");
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = flights.findIndex(flight => flight.Id === parseInt(id));
    if (index !== -1) {
      flights.splice(index, 1);
      return true;
    }
    throw new Error("Flight not found");
  }
};
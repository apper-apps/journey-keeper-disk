import tripsData from "@/services/mockData/trips.json";

let trips = [...tripsData];

export const tripService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...trips];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return trips.find(trip => trip.Id === parseInt(id));
  },

  create: async (tripData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = trips.length > 0 ? Math.max(...trips.map(t => t.Id)) : 0;
    const newTrip = {
      Id: maxId + 1,
      ...tripData,
      actualSpent: 0,
      currency: "USD"
    };
    trips.push(newTrip);
    return { ...newTrip };
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = trips.findIndex(trip => trip.Id === parseInt(id));
    if (index !== -1) {
      trips[index] = { ...trips[index], ...updates };
      return { ...trips[index] };
    }
    throw new Error("Trip not found");
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = trips.findIndex(trip => trip.Id === parseInt(id));
    if (index !== -1) {
      trips.splice(index, 1);
      return true;
    }
    throw new Error("Trip not found");
  }
};
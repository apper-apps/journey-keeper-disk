import accommodationsData from "@/services/mockData/accommodations.json";

let accommodations = [...accommodationsData];

export const accommodationService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...accommodations];
  },

  getByTripId: async (tripId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return accommodations.filter(acc => acc.tripId === tripId.toString());
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return accommodations.find(acc => acc.Id === parseInt(id));
  },

  create: async (accommodationData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = accommodations.length > 0 ? Math.max(...accommodations.map(a => a.Id)) : 0;
    const newAccommodation = {
      Id: maxId + 1,
      ...accommodationData,
      status: accommodationData.status || "pending"
    };
    accommodations.push(newAccommodation);
    return { ...newAccommodation };
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = accommodations.findIndex(acc => acc.Id === parseInt(id));
    if (index !== -1) {
      accommodations[index] = { ...accommodations[index], ...updates };
      return { ...accommodations[index] };
    }
    throw new Error("Accommodation not found");
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = accommodations.findIndex(acc => acc.Id === parseInt(id));
    if (index !== -1) {
      accommodations.splice(index, 1);
      return true;
    }
    throw new Error("Accommodation not found");
  }
};
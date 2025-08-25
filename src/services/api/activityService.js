import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

export const activityService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...activities];
  },

  getByTripId: async (tripId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return activities.filter(activity => activity.tripId === tripId.toString());
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return activities.find(activity => activity.Id === parseInt(id));
  },

  create: async (activityData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = activities.length > 0 ? Math.max(...activities.map(a => a.Id)) : 0;
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      status: activityData.status || "pending"
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = activities.findIndex(activity => activity.Id === parseInt(id));
    if (index !== -1) {
      activities[index] = { ...activities[index], ...updates };
      return { ...activities[index] };
    }
    throw new Error("Activity not found");
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = activities.findIndex(activity => activity.Id === parseInt(id));
    if (index !== -1) {
      activities.splice(index, 1);
      return true;
    }
    throw new Error("Activity not found");
  }
};
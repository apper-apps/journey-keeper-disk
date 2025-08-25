import budgetItemsData from "@/services/mockData/budgetItems.json";

let budgetItems = [...budgetItemsData];

export const budgetService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...budgetItems];
  },

  getByTripId: async (tripId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return budgetItems.filter(item => item.tripId === tripId.toString());
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return budgetItems.find(item => item.Id === parseInt(id));
  },

  create: async (budgetData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = budgetItems.length > 0 ? Math.max(...budgetItems.map(b => b.Id)) : 0;
    const newBudgetItem = {
      Id: maxId + 1,
      ...budgetData,
      isPaid: budgetData.isPaid || false
    };
    budgetItems.push(newBudgetItem);
    return { ...newBudgetItem };
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = budgetItems.findIndex(item => item.Id === parseInt(id));
    if (index !== -1) {
      budgetItems[index] = { ...budgetItems[index], ...updates };
      return { ...budgetItems[index] };
    }
    throw new Error("Budget item not found");
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = budgetItems.findIndex(item => item.Id === parseInt(id));
    if (index !== -1) {
      budgetItems.splice(index, 1);
      return true;
    }
    throw new Error("Budget item not found");
  }
};
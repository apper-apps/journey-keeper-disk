import flightsData from "@/services/mockData/flights.json";

let flights = [...flightsData];

const airlines = [
  "Air France", "American Airlines", "British Airways", "Delta Air Lines", "Emirates",
  "Japan Airlines", "KLM", "Lufthansa", "Qatar Airways", "Singapore Airlines",
  "Southwest Airlines", "Turkish Airlines", "United Airlines", "Virgin Atlantic"
];

const airports = [
  { code: "JFK", name: "John F. Kennedy International Airport, New York" },
  { code: "LAX", name: "Los Angeles International Airport" },
  { code: "CDG", name: "Charles de Gaulle Airport, Paris" },
  { code: "LHR", name: "Heathrow Airport, London" },
  { code: "NRT", name: "Narita International Airport, Tokyo" },
  { code: "DXB", name: "Dubai International Airport" },
  { code: "SIN", name: "Singapore Changi Airport" },
  { code: "FRA", name: "Frankfurt Airport" },
  { code: "AMS", name: "Amsterdam Airport Schiphol" },
  { code: "ORD", name: "O'Hare International Airport, Chicago" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport" },
  { code: "SYD", name: "Sydney Airport" },
  { code: "ICN", name: "Incheon International Airport, Seoul" },
  { code: "BKK", name: "Suvarnabhumi Airport, Bangkok" },
  { code: "MAD", name: "Madrid-Barajas Airport" }
];

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
  },

  getAirlineSuggestions: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return airlines.filter(airline => 
      airline.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  },

  getAirportSuggestions: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return airports.filter(airport => 
      airport.code.toLowerCase().includes(query.toLowerCase()) ||
      airport.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  },

  lookupFlight: async (flightNumber, departureDate) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock flight lookup logic
    const mockFlightData = {
      "AF83": {
        airline: "Air France",
        departureAirport: "JFK",
        arrivalAirport: "CDG",
        departureTime: "20:30",
        arrivalTime: "09:45"
      },
      "DL123": {
        airline: "Delta Air Lines",
        departureAirport: "LAX",
        arrivalAirport: "JFK",
        departureTime: "08:15",
        arrivalTime: "16:45"
      },
      "BA456": {
        airline: "British Airways",
        departureAirport: "LHR",
        arrivalAirport: "JFK",
        departureTime: "14:20",
        arrivalTime: "17:35"
      }
    };

    const flightInfo = mockFlightData[flightNumber.toUpperCase()];
    return flightInfo || null;
  }
};
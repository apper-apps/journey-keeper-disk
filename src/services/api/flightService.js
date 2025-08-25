import flightsData from "@/services/mockData/flights.json";

let flights = [...flightsData];

const airlines = [
  "Aer Lingus", "Air Canada", "Air China", "Air France", "Air India", "Air New Zealand",
  "Alaska Airlines", "Alitalia", "American Airlines", "ANA (All Nippon Airways)", "Austrian Airlines",
  "Avianca", "British Airways", "Cathay Pacific", "Copa Airlines", "Delta Air Lines",
  "EgyptAir", "El Al", "Emirates", "Ethiopian Airlines", "Etihad Airways", "EVA Air",
  "Finnair", "Frontier Airlines", "Hawaiian Airlines", "Iberia", "Icelandair",
  "Japan Airlines", "JetBlue Airways", "Jetstar Airways", "KLM", "Korean Air",
  "LATAM Airlines", "LOT Polish Airlines", "Lufthansa", "Norwegian Air", "Qantas",
  "Qatar Airways", "Royal Air Maroc", "Ryanair", "SAS (Scandinavian Airlines)", "Saudi Arabian Airlines",
  "Singapore Airlines", "South African Airways", "Southwest Airlines", "Spirit Airlines",
  "Swiss International Air Lines", "TAP Air Portugal", "Thai Airways", "Turkish Airlines",
  "United Airlines", "Virgin Atlantic", "Virgin Australia", "Vueling", "WestJet"
];

const airports = [
  // North America
  { code: "JFK", name: "John F. Kennedy International Airport, New York" },
  { code: "LAX", name: "Los Angeles International Airport" },
  { code: "ORD", name: "O'Hare International Airport, Chicago" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport" },
  { code: "DFW", name: "Dallas/Fort Worth International Airport" },
  { code: "DEN", name: "Denver International Airport" },
  { code: "LAS", name: "McCarran International Airport, Las Vegas" },
  { code: "PHX", name: "Phoenix Sky Harbor International Airport" },
  { code: "IAH", name: "George Bush Intercontinental Airport, Houston" },
  { code: "MIA", name: "Miami International Airport" },
  { code: "SEA", name: "Seattle-Tacoma International Airport" },
  { code: "SFO", name: "San Francisco International Airport" },
  { code: "BOS", name: "Logan International Airport, Boston" },
  { code: "MSP", name: "Minneapolis-Saint Paul International Airport" },
  { code: "DTW", name: "Detroit Metropolitan Wayne County Airport" },
  { code: "YYZ", name: "Toronto Pearson International Airport" },
  { code: "YVR", name: "Vancouver International Airport" },
  { code: "YUL", name: "Montreal-Pierre Elliott Trudeau International Airport" },
  
  // Europe
  { code: "LHR", name: "Heathrow Airport, London" },
  { code: "CDG", name: "Charles de Gaulle Airport, Paris" },
  { code: "FRA", name: "Frankfurt Airport" },
  { code: "AMS", name: "Amsterdam Airport Schiphol" },
  { code: "MAD", name: "Madrid-Barajas Airport" },
  { code: "FCO", name: "Leonardo da Vinci International Airport, Rome" },
  { code: "MUC", name: "Munich Airport" },
  { code: "ZUR", name: "Zurich Airport" },
  { code: "VIE", name: "Vienna International Airport" },
  { code: "CPH", name: "Copenhagen Airport" },
  { code: "ARN", name: "Stockholm Arlanda Airport" },
  { code: "OSL", name: "Oslo Airport" },
  { code: "HEL", name: "Helsinki Airport" },
  { code: "IST", name: "Istanbul Airport" },
  { code: "SVO", name: "Sheremetyevo International Airport, Moscow" },
  
  // Asia Pacific
  { code: "NRT", name: "Narita International Airport, Tokyo" },
  { code: "HND", name: "Haneda Airport, Tokyo" },
  { code: "ICN", name: "Incheon International Airport, Seoul" },
  { code: "PVG", name: "Shanghai Pudong International Airport" },
  { code: "PEK", name: "Beijing Capital International Airport" },
  { code: "HKG", name: "Hong Kong International Airport" },
  { code: "SIN", name: "Singapore Changi Airport" },
  { code: "BKK", name: "Suvarnabhumi Airport, Bangkok" },
  { code: "KUL", name: "Kuala Lumpur International Airport" },
  { code: "CGK", name: "Soekarno-Hatta International Airport, Jakarta" },
  { code: "MNL", name: "Ninoy Aquino International Airport, Manila" },
  { code: "TPE", name: "Taiwan Taoyuan International Airport" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport, Mumbai" },
  { code: "DEL", name: "Indira Gandhi International Airport, New Delhi" },
  
  // Australia & New Zealand
  { code: "SYD", name: "Sydney Airport" },
  { code: "MEL", name: "Melbourne Airport" },
  { code: "BNE", name: "Brisbane Airport" },
  { code: "PER", name: "Perth Airport, Australia" },
  { code: "ADL", name: "Adelaide Airport" },
  { code: "DRW", name: "Darwin Airport" },
  { code: "CBR", name: "Canberra Airport" },
  { code: "HBA", name: "Hobart Airport" },
  { code: "AKL", name: "Auckland Airport" },
  { code: "CHC", name: "Christchurch Airport" },
  { code: "WLG", name: "Wellington Airport" },
  
  // Middle East & Africa
  { code: "DXB", name: "Dubai International Airport" },
  { code: "DOH", name: "Hamad International Airport, Doha" },
  { code: "AUH", name: "Abu Dhabi International Airport" },
  { code: "CAI", name: "Cairo International Airport" },
  { code: "JNB", name: "O.R. Tambo International Airport, Johannesburg" },
  { code: "CPT", name: "Cape Town International Airport" },
  { code: "TLV", name: "Ben Gurion Airport, Tel Aviv" },
  { code: "RUH", name: "King Khalid International Airport, Riyadh" },
  { code: "KWI", name: "Kuwait International Airport" },
  { code: "BAH", name: "Bahrain International Airport" },
  
  // South America
  { code: "GRU", name: "São Paulo/Guarulhos International Airport" },
  { code: "GIG", name: "Rio de Janeiro–Galeão International Airport" },
  { code: "EZE", name: "Ezeiza International Airport, Buenos Aires" },
  { code: "SCL", name: "Santiago International Airport" },
  { code: "LIM", name: "Jorge Chávez International Airport, Lima" },
  { code: "BOG", name: "El Dorado International Airport, Bogotá" },
  { code: "UIO", name: "Mariscal Sucre International Airport, Quito" },
  { code: "CCS", name: "Simón Bolívar International Airport, Caracas" }
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
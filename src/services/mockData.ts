import { Cooperative, Route, Vehicule, Trajet, DashboardStats } from "@/types/models";



// Mock data for cooperatives
export const mockCooperatives: Cooperative[] = [
  {
    _id: "67e992518fb6f2e7b746b799",
    name: "Sonatra",
    description: "Transport de luxe entre les grandes villes",
    logo_url: "",
    contact_phone: "+261 32 00 000 00",
    contact_email: "contact@sonatra.mg",
    active: true, 
    cooperative_id: "67e992518fb6f2e7b746b799"
  },
  {
    _id: "67e992518fb6f2e7b746b798",
    name: "Kofmad",
    description: "Services de transport économique",
    logo_url: "",
    contact_phone: "+261 33 00 000 00",
    contact_email: "info@kofmad.mg",
    active: true, 
    cooperative_id: "67e992518fb6f2e7b746b798"
  },
  {
    _id: "67e992518fb6f2e7b746b797",
    name: "Cotisse",
    description: "Voyages confortables à travers Madagascar",
    logo_url: "",
    contact_phone: "+261 34 00 000 00",
    contact_email: "reservations@cotisse.mg",
    active: true, 
    cooperative_id: "67e992518fb6f2e7b746b797"
  }
];

// Mock data for routes
export const mockRoutes: Route[] = [
  {
    _id: "67e31cfd639d03d99d46b7e1",
    province: "Antananarivo",
    departure: "Antananarivo",
    destination: "Antsirabe",
    route: "RN7",
    distance_km: 170, 
    route_id: "67e31cfd639d03d99d46b7e1"
  },
  {
    _id: "67e31cfd639d03d99d46b7e2",
    province: "Antananarivo",
    departure: "Antananarivo",
    destination: "Toamasina",
    route: "RN2",
    distance_km: 355,
    route_id: "67e31cfd639d03d99d46b7e2",
  },
  {
    _id: "67e31cfd639d03d99d46b7e3",
    province: "Antananarivo",
    departure: "Antananarivo",
    destination: "Mahajanga",
    route: "RN4",
    distance_km: 565, 
    route_id: "67e31cfd639d03d99d46b7e3",
  },
  {
    _id: "67e31cfd639d03d99d46b7e4",
    province: "Antananarivo",
    departure: "Antananarivo",
    destination: "Fianarantsoa",
    route: "RN7",
    distance_km: 410, 
    route_id: "67e31cfd639d03d99d46b7e4",
  }
];

// Mock data for vehicles
export const mockVehicles: Vehicule[] = [
  {
    _id: "507f1f77bcf86cd799439011",
    modele: "Mercedes-Benz Sprinter Phase 3",
    capacite: 18,
    numeroImmatriculation: "2568FC",
    equipements: ["Climatisation", "WiFi"],
    etat: "disponible",
    vehicule_id: "507f1f77bcf86cd799439011",
  },
  {
    _id: "507f1f77bcf86cd799439012",
    modele: "Toyota Coaster",
    capacite: 22,
    numeroImmatriculation: "1234TG",
    equipements: ["Climatisation", "TV", "USB"],
    etat: "disponible", 
    vehicule_id: "507f1f77bcf86cd799439012",

  },
  {
    _id: "507f1f77bcf86cd799439013",
    modele: "Iveco Daily",
    capacite: 16,
    numeroImmatriculation: "5678AB",
    equipements: ["Climatisation"],
    etat: "maintenance" , 
    vehicule_id: "507f1f77bcf86cd799439013",
  },
  {
    _id: "507f1f77bcf86cd799439014",
    modele: "Toyota Hiace",
    capacite: 14,
    numeroImmatriculation: "9012CD",
    equipements: ["WiFi", "USB"],
    etat: "disponible", 
    vehicule_id: "507f1f77bcf86cd799439014",
  }
];

// Mock data for trips
export const mockTrips: Trajet[] = [
  {
    _id: "67ed358eea78c533bc46b799",
    route_id: "67e31cfd639d03d99d46b7e1",
    prix: 25000,
    heure_de_depart: "17:00",
    heure_d_arrivee: "21:00",
    date: "2025-03-30",
    vehicule_id: ["507f1f77bcf86cd799439011"],
    cooperative_id: "67e992518fb6f2e7b746b799",
    routeDetails: {
      departure: "",
      destination: "",
      route_id: "",
      _id: "",
      province: "",
      route: "",
      distance_km: 0
    },
    trajet_id: "",
    route_details: undefined,
    cooperative_details: undefined,
    vehicule_details: undefined
  },
  {
    _id: "67ed358eea78c533bc46b798",
    route_id: "67e31cfd639d03d99d46b7e2",
    prix: 50000,
    heure_de_depart: "06:00",
    heure_d_arrivee: "14:00",
    date: "2025-03-31",
    vehicule_id: ["507f1f77bcf86cd799439012"],
    cooperative_id: "67e992518fb6f2e7b746b798",
    routeDetails: {
      departure: "",
      destination: "",
      route_id: "",
      _id: "",
      province: "",
      route: "",
      distance_km: 0
    },
    trajet_id: "",
    route_details: undefined,
    cooperative_details: undefined,
    vehicule_details: undefined
  },
  {
    _id: "67ed358eea78c533bc46b797",
    route_id: "67e31cfd639d03d99d46b7e3",
    prix: 70000,
    heure_de_depart: "05:30",
    heure_d_arrivee: "16:30",
    date: "2025-04-01",
    vehicule_id: ["507f1f77bcf86cd799439014"],
    cooperative_id: "67e992518fb6f2e7b746b797",
    routeDetails: {
      departure: "",
      destination: "",
      route_id: "",
      _id: "",
      province: "",
      route: "",
      distance_km: 0
    },
    trajet_id: "",
    route_details: undefined,
    cooperative_details: undefined,
    vehicule_details: undefined
  },
  {
    _id: "67ed358eea78c533bc46b796",
    route_id: "67e31cfd639d03d99d46b7e4",
    prix: 45000,
    heure_de_depart: "07:00",
    heure_d_arrivee: "15:30",
    date: "2025-04-02",
    vehicule_id: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"],
    cooperative_id: "67e992518fb6f2e7b746b799",
    routeDetails: {
      departure: "",
      destination: "",
      route_id: "",
      _id: "",
      province: "",
      route: "",
      distance_km: 0
    },
    trajet_id: "",
    route_details: undefined,
    cooperative_details: undefined,
    vehicule_details: undefined
  }
];

// Mock dashboard statistics
export const mockDashboardStats: DashboardStats = {
  totalCooperatives: mockCooperatives.length,
  totalRoutes: mockRoutes.length,
  totalVehicles: mockVehicles.length,
  totalTrips: mockTrips.length,
  upcomingTrips: 15,
  activeVehicles: mockVehicles.filter(v => v.etat === "disponible").length,
};

// Mock reservations data
export const mockVoyageurs = [
  {
    _id: "67e7085ce0f94190d4fcf057",
    nom: "Ramaroson",
    prenom: "Jean",
    email: "jean.ramaroson@example.com",
    telephone: "034 50 123 45"
  },
  {
    _id: "67e7085ce0f94190d4fcf058",
    nom: "Razafindrakoto",
    prenom: "Aina",
    email: "aina.raza@example.com",
    telephone: "033 45 678 90"
  }
];

export const mockReservations = [
  {
    _id: "67f2c247a4722035d6214a84",
    reference: "RES-2025-0001",
    trajetid: "67ed358eea78c533bc46b799",
    vehicle_id: "67e461d4098ee2bce546b7b4",
    voyageur_id: "67e7085ce0f94190d4fcf057",
    nombre_places: 2,
    places: { "67e461d4098ee2bce546b7b4": [1, 2] },
    statut: "en_attente",
    date_reservation: "2025-04-06T18:04:57.706Z",
    created_at: "2025-04-06T18:04:55.269633"
  },
  {
    _id: "67f2c247a4722035d6214a85",
    reference: "RES-2025-0002",
    trajetid: "67ed358eea78c533bc46b799",
    vehicle_id: "67e461d4098ee2bce546b7b4",
    voyageur_id: "67e7085ce0f94190d4fcf058",
    nombre_places: 1,
    places: { "67e461d4098ee2bce546b7b4": [5] },
    statut: "confirmé",
    date_reservation: "2025-04-05T14:30:00.000Z",
    created_at: "2025-04-05T14:30:00.000Z"
  },
  {
    _id: "67f2c247a4722035d6214a86",
    reference: "RES-2025-0003",
    trajetid: "67ed358eea78c533bc46b79f",
    vehicle_id: "507f1f77bcf86cd799439011",
    voyageur_id: "67e7085ce0f94190d4fcf057",
    nombre_places: 3,
    places: { "507f1f77bcf86cd799439011": [10, 11, 12] },
    statut: "annulé",
    date_reservation: "2025-04-04T09:15:30.000Z",
    created_at: "2025-04-04T09:15:30.000Z"
  }
];

// Helper function to get a trip with all related data
export const getEnrichedTrips = (): Trajet[] => {
  return mockTrips.map(trip => {
    const routeDetails = mockRoutes.find(route => route._id === trip.route_id);
    const cooperativeDetails = mockCooperatives.find(coop => coop._id === trip.cooperative_id);
    const vehiculeDetails = mockVehicles.filter(veh => trip.vehicule_id.includes(veh._id));
    
    return {
      ...trip,
      routeDetails,
      cooperativeDetails,
      vehiculeDetails
    };
  });
};

// Enrich reservations with related data
export const getEnrichedReservations = () => {
  return mockReservations.map(reservation => {
    const trajet = mockTrips.find(t => t._id === reservation.trajetid);
    const vehicle = mockVehicles.find(v => v._id === reservation.vehicle_id);
    const voyageur = mockVoyageurs.find(v => v._id === reservation.voyageur_id);
    
    // Enrich with related data
    let enrichedTrajet;
    if (trajet) {
      const route = mockRoutes.find(r => r._id === trajet.route_id);
      const cooperative = mockCooperatives.find(c => c._id === trajet.cooperative_id);
      
      enrichedTrajet = {
        ...trajet,
        routeDetails: route,
        cooperativeDetails: cooperative
      };
    }
    
    return {
      ...reservation,
      trajetDetails: enrichedTrajet,
      vehicleDetails: vehicle,
      voyageurDetails: voyageur
    };
  });
};

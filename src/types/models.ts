export interface Cooperative {
  cooperative_id: string
  _id: string;
  name: string;
  description: string;
  logo_url: string;
  contact_phone: string;
  contact_email: string;
  active: boolean;
}


export interface CooperativeCreate {
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  active?: boolean;
}

export interface RouteCreate {
  province: string;
  departure: string;
  destination: string;
  route: string;
  distance_km: number;
}
export type CooperativeUpdate = Partial<CooperativeCreate> & { _id?: string };

export interface Route {
  route_id:string;
  _id: string;
  province: string;
  departure: string;
  destination: string;
  route: string;
  distance_km: number;
}

export interface Vehicule {
  vehicule_id: string;
  _id: string;
  modele: string;
  capacite: number;
  numeroImmatriculation: string;
  equipements: string[];
  etat: string;
}





//******************************************************************************************* */















// models.ts   ----- Trajet -------

export interface RouteDetails {
  _id: string;
  province: string;
  departure: string;
  destination: string;
  route: string;
  distance_km: number;
  route_id: string
}

export interface VehiculeDetails {
  _id: string;
  modele: string;
  capacite: number;
  numeroImmatriculation: string;
  equipements: string[];
  etat: string;
  vehicule_id: string
}

export interface CooperativeDetails {
  name: string;
  description: string;
  logo_url: string;
  contact_phone: string;
  contact_email: string;
  active: boolean;
  cooperative_id:string
}

export interface Trajet {
  trajet_id: string;
  route_details: any;
  cooperative_details: any;
  vehicule_details: any;
  _id: string;
  route_id: string;
  prix: number;
  heure_de_depart: string;
  heure_d_arrivee: string;
  date: string;
  vehicule_id: string[];
  cooperative_id: string;
  routeDetails?: Route;
  cooperativeDetails?: Cooperative;
  vehiculeDetails?: Vehicule[];
}
///-------------------------------------------------------------------------------


// export interface Voyageur {
//   _id: string;
//   nom: string;
//   prenom: string;
//   email: string;
//   telephone: string;
// }

// export interface Reservation {
//   _id: string;
//   reference: string;
//   trajetid: string;
//   vehicle_id: string;
//   voyageur_id: string;
//   nombre_places: number;
//   places: Record<string, number[]>;
//   statut: string;
//   date_reservation: string;
//   created_at: string;
//   trajetDetails?: Trip;
//   vehicleDetails?: Vehicle;
//   voyageurDetails?: Voyageur;
// }







// types/models.ts

// export interface Route {
//   province: string;
//   departure: string;
//   destination: string;
//   route: string;
//   distance_km: number;
// }

export interface TrajetRoute {
  id: string | null;
  route_id: string | null;
  prix: number | null;
  heure_de_depart: string | null;
  heure_d_arrivee: string | null;
  date: string | null;
  vehicule_id: string[] | null;
}

// export interface Vehicule {
//   id: string | null;
//   modele: string | null;
//   capacite: number | null;
//   numeroImmatriculation: string | null;
//   equipements: string[] | null;
//   etat: string | null;
// }



// export interface Reservation {
//   id: string;
//   trajetid: string;
//   vehicle_id: string;
//   voyageur_id: string;
//   nombre_places: number;
//   places: { [key: string]: number[] };
//   statut: string;
//   date_reservation: string;
//   created_at: string;
//   trajet: TrajetRoute | null;
//   vehicule: Vehicule | null;
//   voyageur: Voyageur | null;
// }

// export interface Trip {
//   _id: string;
//   date: string;
//   prix: number | null;
//   heure_de_depart: string | null;
//   heure_d_arrivee: string | null;
//   routeDetails?: Route;
//   vehicule_id: string[];
//   vehiculeDetails?: Vehicule[];
//   cooperativeDetails?: {
//     name: string;
//   };
// }

// New: Add GroupedReservation interface
export interface GroupedReservation {
  date: string;
  vehicles: {
    [vehicleId: string]: Reservation[]; // Key is vehicle_id, value is array of reservations
  };
}




















// models.ts
export interface Trip_Reservation{
  cooperative_id: string;
  route_id: string; 
  _id: string;
  routeDetails: {
    departure: string;
    destination: string;
  };
  prix: number;
  heure_de_depart: string;
  heure_d_arrivee: string;
  date: string;
  vehicule_id: string[];
  vehiculeDetails?: {
    _id: string;
    modele: string;
    numeroImmatriculation: string;
    // Add other vehicle fields as needed
  }[];
  cooperativeDetails?: {
    name: string;
    // Add other cooperative fields as needed
  };
  // Add other trip fields as needed
}

export interface Voyageur {
  _id: string;
  email: string;
  telephone: string;
  nom: string;
  prenom: string;
  // Add other voyageur fields as needed
}

export interface Reservation {
  _id: string;
  trajetid: string;
  vehicle_id: string;
  voyageur_id: string;
  nombre_places: number;
  places: Record<string, string[]>; // Changed from number[] to string[]
  statut: string;
  date_reservation: string;
  created_at: string;
  reference?: string; // Optional as before
  trajetDetails: Trip_Reservation;
  vehiculeDetails: {
    _id: string;
    modele: string;
    capacite: number;
    numeroImmatriculation: string;
    equipements: string[];
    etat: string;
  };
  voyageurDetails: Voyageur;
}


// For dashboard statistics
export interface DashboardStats {
  totalCooperatives: number;
  totalRoutes: number;
  totalVehicles: number;
  totalTrips: number;
  upcomingTrips: number;
  activeVehicles: number;
}

// New type for grouping travelers on same trip/vehicle
export interface TripPassengers {
  trip: Trip_Reservation;
  vehicle: Vehicule;
  date: string;
  passengers: Voyageur[];
}


export interface ReservationResponse {
  id: string;
  trajetid: string;
  vehicle_id: string;
  voyageur_id: string;
  nombre_places: number;
  places: Record<string, string[]>;
  statut: string;
  date_reservation: string;
  created_at: string;
  reference?: string; // Make this optional if not always present
  trajet: {
    id: string | null;
    route_id: string | null;
    prix: number | null;
    heure_de_depart: string | null;
    heure_d_arrivee: string | null;
    date: string | null;
    vehicule_id: string[] | null;
  };
  vehicule: {
    id: string | null;
    modele: string | null;
    capacite: number | null;
    numeroImmatriculation: string | null;
    equipements: string[] | null;
    etat: string | null;
  };
  voyageur: {
    id: string | null;
    email: string | null;
    telephone: string | null;
    nom?: string; // Add if available
    prenom?: string; // Add if available
  };
}

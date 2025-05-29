
import { 
  mockCooperatives, 
  mockRoutes, 
  mockVehicles, 
  mockTrips, 
  mockDashboardStats,
  mockReservations,
  getEnrichedTrips,
  getEnrichedReservations
} from './mockData';
import { Cooperative, CooperativeCreate, 
  CooperativeUpdate, Route, Vehicule, Trip_Reservation, DashboardStats, Reservation,  
  Trajet, RouteCreate} from '@/types/models';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE_URL = '/api'; // Replace with your FastAPI backend URL



//Cooperatives API
// export const getCooperatives = async () => {
//     const response = await fetch(`/api/cooperatives/`)
//     return response.json();
// };


export const getCooperatives_Count = async () => {
    const response = await fetch(`/api/cooperatives/counte/`)
    return response.json();
};

export const getRoutes_Count = async () => {
  const response = await fetch(`/api/routes/counte/`)
  return response.json();
};
export const getVehicules_Count = async () => {
  const response = await fetch(`/api/vehicules/counte/`)
  return response.json();
};
export const getTrajets_Count = async () => {
  const response = await fetch(`/api/trajets/counte/`)
  return response.json();
};




// 1. Get Cooperative by ID
export const getCooperativeById = async (cooperative_id: string) => {
  try {
    const response = await fetch(`/api/cooperatives/${cooperative_id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cooperative');
    }
    return await response.json();
  } catch (error) {
    const mockCoop = mockCooperatives.find(coop => coop.cooperative_id === cooperative_id);
    if (!mockCoop) throw new Error('Mock data not found for this cooperative');
    return mockCoop;
  }
};

// 2. Get All Cooperatives
export const getCooperatives = async () => {
  try {
    const response = await fetch(`/api/cooperatives/`);
    if (!response.ok) {
      throw new Error('Failed to fetch cooperatives');
    }
    return await response.json();
  } catch (error) {
    return mockCooperatives; // Retourner les données mock en cas d'échec
  }
};

// 3. Create Cooperative
export const createCooperative = async (cooperative: CooperativeCreate) => {
  await delay(500);
  try {
    const response = await fetch(`/api/cooperatives/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cooperative),
    });
    if (!response.ok) throw new Error('Failed to create cooperative');
    return await response.json();
  } catch (error) {
    console.warn("Creating cooperative failed, returning mock response. Data was:", cooperative);
    return { ...cooperative, cooperative_id: Date.now().toString(), _id: Date.now().toString() }; // Simuler un nouvel ID
  }
};




// 4. Update Cooperative
export const updateCooperative = async (cooperativeData: { cooperative_id: string } & Partial<CooperativeCreate>) => {
    const response = await fetch(`/api/cooperatives/${cooperativeData.cooperative_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cooperativeData),
    });
    //if (!response.ok) throw new Error('Failed to update cooperative');
    return await response.json();
};

// 5. Delete Cooperative
export const deleteCooperative = async (cooperative_id: string) => {
  try {
    const response = await fetch(`/api/cooperatives/${cooperative_id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete cooperative');
    return true;
  } catch (error) {
    const mockIndex = mockCooperatives.findIndex(coop => coop.cooperative_id === cooperative_id);
    if (mockIndex !== -1) {
      mockCooperatives.splice(mockIndex, 1);
      return true;
    }
    throw new Error('Failed to delete cooperative and no mock data found');
  }
};












export const getFilteredRoute = async (route_id: string) => {
  const response = await fetch(`/api/routes/${route_id}`);
  return response.json();
};

export const getFilteredVehicule = async (vehicule_id: string) => {
  const response = await fetch(`/api/vehicules/${vehicule_id}`);
  return response.json();
};

export const getFilteredCooperative = async (cooperative_id: string) => {
  const response = await fetch(`/api/cooperatives/${cooperative_id}`);
  return response.json();
};


// Routes API
export const getRoutes = async () => {
  try{
      const response = await fetch(`/api/routes/`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des routes');
      return response.json();
  } 
  catch (error) {
      return mockRoutes; // Retourner les données mock en cas d'échec
  }
};

export const getRouteById = async (route_id: string) => {
  const response = await fetch(`/api/routes/${route_id}`);
  return response.json();
};


export const createRoute  = async (routeData: RouteCreate) => {
  const response = await fetch(`/api/routes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routeData),
  });
  // if (!response.ok) throw new Error('Erreur lors de la création du véhicule');
  // return response.json();
};

export const updateRoute  = async (routeData: { route_id: string } & any) => {
  const response = await fetch(`/api/routes/${routeData.route_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routeData),
  });
  //if (!response.ok) throw new Error('Erreur lors de la mise à jour du véhicule');
  //return response.json();
};

export const deleteRoute  = async (route_id: string) => {
  const response = await fetch(`/api/routes/${route_id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression du véhicule');
};


// // Vehicules API
export const getVehicules = async () => {
  try{
    const response = await fetch(`/api/vehicules/`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des véhicules');
    return response.json();
  }catch (error){
    return mockVehicles
  }
};
export const getVehicules_touts = async () => {
  try{
    const response = await fetch(`/api/vehicules/toutes/`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des véhicules');
    return response.json();
  }catch (error){
    return mockVehicles
  }
};

export const createVehicule = async (vehiculeData: any) => {
  const response = await fetch(`/api/vehicules/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehiculeData),
  });
  // if (!response.ok) throw new Error('Erreur lors de la création du véhicule');
  // return response.json();
};


export const updateVehicule = async (vehiculeData: { vehicule_id: string } & any) => {
  const response = await fetch(`/api/vehicules/${vehiculeData.vehicule_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehiculeData),
  });
  //if (!response.ok) throw new Error('Erreur lors de la mise à jour du véhicule');
  //return response.json();
};

export const deleteVehicule = async (vehicule_id: string) => {
  const response = await fetch(`/api/vehicules/${vehicule_id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression du véhicule');
};




// Trips API

//------------------------- Trip ------------------------
// api.ts

export  const getTrips = async () => {
  try{
    const response = await fetch(`${API_BASE_URL}/trajets/`)
    if (!response.ok) throw new Error('Erreur lors de la récupération des trajets');
    return response.json();
  }catch(error){
    return mockTrips
  }
}

export const getVehiculeById = async (vehicule_id: string) => {
  const response = await fetch(`/api/vehicules/${vehicule_id}`);
  return response.json();
};

export  const createTrip = async (trajetData: any) => {
  const response = await fetch(`/api/trajets/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trajetData),
  });
  // if (!response.ok) throw new Error('Erreur lors de la création du trajet');
  // return response.json();
}

export const updateTrip = async (trajetData: { trajet_id: string } & any) => {
  const response = await fetch(`/api/trajets/${trajetData.trajet_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trajetData),
  });
  //if (!response.ok) throw new Error('Erreur lors de la mise à jour du véhicule');
  //return response.json();
};



export const deleteTrip = async (trajet_id: string) => {
  const response = await fetch(`/api/trajets/${trajet_id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erreur lors de la suppression du véhicule');
};





// Reservations API
export const getReservations = async () => {
  // await delay(500);
  // const reservations = getEnrichedReservations();
  
  // if (date) {
  //   return reservations.filter(res => {
  //     // Filter by trajet date
  //     if (res.trajetDetails && res.trajetDetails.date === date) {
  //       return true;
  //     }
  //     return false;
  //   });
  // }
}
  
//   return reservations;
// };

// Base URL for your API


export const createReservation = async (reservationData: Partial<Reservation>): Promise<Reservation[]> => {
  // const response = await axios.post<Reservation>(API_URL, reservationData);
  // return response.data;
  return null
};

export const updateReservation = async (reservationData: Partial<Reservation> & { _id: string }): Promise<Reservation[]> => {
  // const response = await axios.put<Reservation>(`${API_URL}/${reservationData._id}`, reservationData);
  // return response.data;
  return null
};

export const deleteReservation = async (id: string): Promise<void> => {
  // await axios.delete(`${API_URL}/${id}`);
};








// services/api.ts


const fetchWrapper = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};



export const getReservationsByTrip = async (tripId: string, vehiculeId: string) => {
  try {
    return await fetchWrapper(`${API_BASE_URL}/reservations/?tripId=${tripId}&vehiculeId=${vehiculeId}`);
  } catch (error) {
    console.error('Error fetching reservations by trip:', error);
    throw error;
  }
};









// src/services/api.ts

export const getGroupedReservations = async (date?: string) => {
  const url = `${API_BASE_URL}/reservations/grouped-reservations${date ? `?date=${date}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json(); // Assurez-vous de retourner les données JSON
};








// Définir et exporter l'interface DashboardStats avec les champs supplémentaires


// Fonction pour obtenir les statistiques du tableau de bord
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [cooperatives, routes, vehicles, trips] = await Promise.all([
      getCooperatives_Count(),
      getRoutes_Count(),
      getVehicules_Count(),
      getTrajets_Count(),
    ]);

    // Initialiser les nouveaux champs avec 0 ou des valeurs par défaut si non disponibles
    return {
      totalCooperatives: cooperatives.count || 0,
      totalRoutes: routes.count || 0,
      totalVehicles: vehicles.count || 0,
      totalTrips: trips.count || 0,
      activeVehicles: 0,  // Valeur par défaut, à ajuster si votre backend le fournit
      upcomingTrips: 0,   // Valeur par défaut, à ajuster si votre backend le fournit
    };
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
  }
};

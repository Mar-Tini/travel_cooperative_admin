// src/services/dashboard.ts
import { getCooperatives_Count, getRoutes_Count, getVehicules_Count, getTrajets_Count } from './api';

import { DashboardStats } from '@/types/models';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [cooperatives, routes, vehicles, trips] = await Promise.all([
      getCooperatives_Count(),
      getRoutes_Count(),
      getVehicules_Count(),
      getTrajets_Count(),
    ]);

    return {
      totalCooperatives: cooperatives.count || 0,
      totalRoutes: routes.count || 0,
      totalVehicles: vehicles.count || 0,
      totalTrips: trips.count || 0,
      activeVehicles: 0, // Valeur par défaut, à ajuster si votre backend le fournit
      upcomingTrips: 0,  // Valeur par défaut, à ajuster si votre backend le fournit
    };
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
  }
};
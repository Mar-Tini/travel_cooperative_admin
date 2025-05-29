// src/components/Dashboard/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/services/dashboard'; // Ajustez le chemin
import { DashboardStats } from '@/types/models';
import { DashboardStatsCards } from './DashboardStats';
import { DashboardActivity } from './DashboardActivity';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery<DashboardStats, Error>({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Erreur lors du chargement des statistiques: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des statistiques de TravelCoop Admin.
        </p>
      </div>
      
      {stats && <DashboardStatsCards stats={stats} />}
      
      <Separator />

      <DashboardActivity />
    </div>
  );
};

export default Dashboard;
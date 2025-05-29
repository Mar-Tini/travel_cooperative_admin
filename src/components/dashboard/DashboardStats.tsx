// src/components/Dashboard/DashboardStats.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/ui/stats-card';
import { Users, MapPin, Car, Calendar } from 'lucide-react';
import { DashboardStats } from '@/types/models';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export const DashboardStatsCards: React.FC<DashboardStatsProps> = ({ stats }) => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        title="Total des Coopératives" 
        value={stats.totalCooperatives || 0} 
        description={`${0} actifs`} 
        icon={<Users className="h-4 w-4" />}
        onClick={() => handleCardClick('/cooperatives')}
        className="cursor-pointer hover:bg-gray-100 transition-colors"
      />
      <StatsCard 
        title="Total des Routes" 
        value={stats.totalRoutes || 0} 
        description={`${0} actifs`} 
        icon={<MapPin className="h-4 w-4" />}
        onClick={() => handleCardClick('/routes')}
        className="cursor-pointer hover:bg-gray-100 transition-colors"
      />
      <StatsCard 
        title="Total des Véhicules" 
        value={stats.totalVehicles || 0}
        description={`${stats.activeVehicles || 0} actifs`} 
        icon={<Car className="h-4 w-4" />}
        onClick={() => handleCardClick('/vehicules')}
        className="cursor-pointer hover:bg-gray-100 transition-colors"
      />
      <StatsCard 
        title="Total des Trajets" 
        value={stats.totalTrips || 0}
        description={`${stats.upcomingTrips || 0} à venir`} 
        icon={<Calendar className="h-4 w-4" />}
        onClick={() => handleCardClick('/trajets')}
        className="cursor-pointer hover:bg-gray-100 transition-colors"
      />
    </div>
  );
};
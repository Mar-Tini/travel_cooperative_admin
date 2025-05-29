
// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getDashboardStats } from '@/services/api';
// import { StatsCard } from '@/components/ui/stats-card';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { BarChart3, Users, MapPin, Calendar, Car, TrendingUp, Bus } from 'lucide-react';
// import { LoadingSpinner } from '@/components/ui/loading-spinner';
// import { Separator } from '@/components/ui/separator';

// const Dashboard = () => {
//   const { data: stats, isLoading, error } = useQuery({
//     queryKey: ['dashboardStats'],
//     queryFn: getDashboardStats,
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <p className="text-red-500">Erreur lors du chargement des statistiques</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
//         <p className="text-muted-foreground">
//           Vue d'ensemble des statistiques de TravelCoop Admin.
//         </p>
//       </div>
      
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatsCard 
//           title="Total des Coopératives" 
//           value={stats?.totalCooperatives || 0} 
//           icon={<Users className="h-4 w-4" />}
//         />
//         <StatsCard 
//           title="Total des Routes" 
//           value={stats?.totalRoutes || 0} 
//           icon={<MapPin className="h-4 w-4" />}
//         />
//         <StatsCard 
//           title="Total des Véhicules" 
//           value={stats?.totalVehicles || 0}
//           description={`${stats?.activeVehicles || 0} actifs`}
//           icon={<Car className="h-4 w-4" />}
//         />
//         <StatsCard 
//           title="Total des Trajets" 
//           value={stats?.totalTrips || 0}
//           description={`${stats?.upcomingTrips || 0} à venir`}
//           icon={<Calendar className="h-4 w-4" />}
//         />
//       </div>
      
//       <Separator />
      
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         <Card className="lg:col-span-4">
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <TrendingUp className="mr-2 h-4 w-4" /> 
//               Activité Récente
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pl-2">
//             <div className="space-y-4">
//               <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
//                 <div className="h-9 w-9 rounded-full bg-travelcoop-100 flex items-center justify-center text-travelcoop-800">
//                   <Calendar className="h-5 w-5" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium">Nouveau trajet ajouté</p>
//                   <p className="text-sm text-muted-foreground">Antananarivo - Toamasina</p>
//                 </div>
//                 <div className="ml-auto text-sm text-muted-foreground">Il y a 2 heures</div>
//               </div>
//               <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
//                 <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-800">
//                   <Users className="h-5 w-5" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium">Nouvelle coopérative</p>
//                   <p className="text-sm text-muted-foreground">Cotisse a rejoint la plateforme</p>
//                 </div>
//                 <div className="ml-auto text-sm text-muted-foreground">Il y a 5 heures</div>
//               </div>
//               <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
//                 <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
//                   <Car className="h-5 w-5" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium">Véhicule en maintenance</p>
//                   <p className="text-sm text-muted-foreground">Iveco Daily - 5678AB</p>
//                 </div>
//                 <div className="ml-auto text-sm text-muted-foreground">Il y a 1 jour</div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card className="lg:col-span-3">
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Bus className="mr-2 h-4 w-4" />
//               Trajets Populaires
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <div className="flex items-center">
//                   <div className="w-full">
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm font-medium">Antananarivo - Toamasina</span>
//                       <span className="text-sm font-medium">68%</span>
//                     </div>
//                     <div className="w-full bg-muted rounded-full h-2.5">
//                       <div className="bg-travelcoop-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center">
//                   <div className="w-full">
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm font-medium">Antananarivo - Antsirabe</span>
//                       <span className="text-sm font-medium">52%</span>
//                     </div>
//                     <div className="w-full bg-muted rounded-full h-2.5">
//                       <div className="bg-travelcoop-500 h-2.5 rounded-full" style={{ width: "52%" }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center">
//                   <div className="w-full">
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm font-medium">Antananarivo - Mahajanga</span>
//                       <span className="text-sm font-medium">42%</span>
//                     </div>
//                     <div className="w-full bg-muted rounded-full h-2.5">
//                       <div className="bg-travelcoop-500 h-2.5 rounded-full" style={{ width: "42%" }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center">
//                   <div className="w-full">
//                     <div className="flex justify-between mb-1">
//                       <span className="text-sm font-medium">Antananarivo - Fianarantsoa</span>
//                       <span className="text-sm font-medium">35%</span>
//                     </div>
//                     <div className="w-full bg-muted rounded-full h-2.5">
//                       <div className="bg-travelcoop-500 h-2.5 rounded-full" style={{ width: "35%" }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/services/api'; // Ajustez le chemin d'importation
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, MapPin, Calendar, Car, TrendingUp, Bus } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { DashboardStats } from '@/types/models';

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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total des Coopératives" 
          value={stats?.totalCooperatives || 0} 
          description={`${0} actifs`} 
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard 
          title="Total des Routes" 
          value={stats?.totalRoutes || 0} 
          description={`${0} actifs`} 
          icon={<MapPin className="h-4 w-4" />}
        />
        <StatsCard 
          title="Total des Véhicules" 
          value={stats?.totalVehicles || 0}
          description={`${0} actifs`} // Ajustez si vous avez des données sur les véhicules actifs
          icon={<Car className="h-4 w-4" />}
        />
        <StatsCard 
          title="Total des Trajets" 
          value={stats?.totalTrips || 0}
          description={`${0} à venir`} // Ajustez si vous avez des données sur les trajets à venir
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>
      
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" /> 
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
                <div className="h-9 w-9 rounded-full bg-travelcoop-100 flex items-center justify-center text-travelcoop-800">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Nouveau trajet ajouté</p>
                  <p className="text-sm text-muted-foreground">Antananarivo - Toamasina</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">Il y a 2 heures</div>
              </div>
              {/* Ajoutez d'autres activités récentes si nécessaire */}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bus className="mr-2 h-4 w-4" />
              Trajets Populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Les données des trajets populaires sont statiques ici, mais vous pourriez les récupérer via une autre API */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Antananarivo - Toamasina</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-travelcoop-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Ajoutez d'autres trajets populaires ici */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
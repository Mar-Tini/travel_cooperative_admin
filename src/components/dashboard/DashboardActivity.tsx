// src/components/Dashboard/DashboardActivity.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Bus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const DashboardActivity: React.FC = () => {
  return (
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
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"> {/* Remplacez par votre icône Calendar */}<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>
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
  );
};
// import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getGroupedReservations } from '@/services/api';
// import { format, parseISO } from 'date-fns';
// import { fr } from 'date-fns/locale';
// import { Calendar } from '@/components/ui/calendar';
// import { 
//   Card, 
//   CardContent, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle,
//   CardDescription 
// } from '@/components/ui/card';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { 
//   MapPin, 
//   Calendar as CalendarIcon, 
//   Clock, 
//   Bus, 
//   Users, 
//   Filter 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { LoadingSpinner } from '@/components/ui/loading-spinner';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; // Import explicite de autoTable

// // Définir les types
// interface Vehicle {
//   vehicle_id: string;
//   numero_immatriculation: string;
//   modele: string;
//   capacite: number;
//   reservations: Reservation[];
// }

// interface Reservation {
//   voyageur_nom: string;
//   voyageur_id: string;
//   voyageur_email: string;
//   voyageur_telephone: string;
//   nombre_places: number;
//   places: string[];
//   statut: string;
//   date_reservation: string;
// }

// interface GroupedReservationResponse {
//   trajet_id: string;
//   date: string;
//   route_info: {
//     departure: string;
//     destination: string;
//   };
//   prix: number;
//   heure_depart: string;
//   heure_arrivee: string;
//   vehicules: Vehicle[];
// }

// const TripCards = () => {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [selectedTrip, setSelectedTrip] = useState<GroupedReservationResponse | null>(null);
//   const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
//   const [showPassengers, setShowPassengers] = useState(false);

//   // Format selected date as string for filtering
//   const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;

//   // Fetch grouped reservations
//   const { data: reservations, isLoading, error } = useQuery<GroupedReservationResponse[], Error>({
//     queryKey: ['grouped-reservations', formattedDate],
//     queryFn: () => getGroupedReservations(formattedDate),
//     enabled: !!formattedDate || !selectedDate,
//   });

//   const handleTripClick = (trip: GroupedReservationResponse, vehicleId: string) => {
//     setSelectedTrip(trip);
//     setSelectedVehicle(vehicleId);
//     setShowPassengers(true);
//   };

//   const handleBackToTrips = () => {
//     setSelectedTrip(null);
//     setSelectedVehicle(null);
//     setShowPassengers(false);
//   };

//   const formatMoney = (amount: number) => {
//     return new Intl.NumberFormat('fr-MG', {
//       style: 'currency',
//       currency: 'MGA',
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'confirmee':
//         return <Badge className="bg-green-500">Confirmé</Badge>;
//       case 'en_attente':
//         return <Badge className="bg-blue-500">En attente</Badge>;
//       case 'annulé':
//         return <Badge variant="destructive">Annulé</Badge>;
//       default:
//         return <Badge variant="outline">En attente</Badge>;
//     }
//   };

//   // Générer un PDF des données des voyageurs
//   const generatePDF = () => {
//     const doc = new jsPDF();
//     const tableColumn = ["Nom", "Email", "Téléphone", "Places", "Statut"];
//     const tableRows = [];

//     const vehicleReservations = selectedTrip?.vehicules.find((v) => v.vehicle_id === selectedVehicle)?.reservations || [];

//     vehicleReservations.forEach(reservation => {
//       const reservationData = [
//         reservation.voyageur_nom,
//         reservation.voyageur_id,
//         reservation.voyageur_email,
//         reservation.voyageur_telephone,
//         `${reservation.nombre_places} ${reservation.nombre_places > 1 ? 'places' : 'place'}`,
//         reservation.statut
//       ];
//       tableRows.push(reservationData);
//     });

//     doc.text(`Voyageurs - Trajet: ${selectedTrip?.route_info.departure} - ${selectedTrip?.route_info.destination}`, 14, 15);
//     doc.text(`Date: ${selectedTrip?.date ? format(parseISO(selectedTrip?.date), 'dd MMMM yyyy', { locale: fr }) : ''}`, 14, 25);
//     doc.text(`Véhicule: ${selectedTrip?.vehicules.find((v) => v.vehicle_id === selectedVehicle)?.modele}`, 14, 35);

//     // Appliquer autoTable en appelant la fonction importée
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 45,
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [41, 128, 185] },
//     });

//     doc.save(`voyageurs_trajet_${selectedTrip?.trajet_id}.pdf`);
//   };

//   // Filtrer les réservations par date sélectionnée
//   const filteredReservations = reservations?.filter((reservation) => {
//     if (!selectedDate) return true;
//     return format(parseISO(reservation.date), 'yyyy-MM-dd') === formattedDate;
//   }) || [];

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-60">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500">
//         Erreur : {error.message}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Réservations</h1>
//           <p className="text-muted-foreground">
//              Liste des trajets disponibles en blocs.
//           </p>
//         </div>
        
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" className="flex items-center">
//               <Filter className="h-4 w-4 mr-2" />
//               {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Filtrer par date'}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent align="end" className="w-auto p-0 pointer-events-auto">
//             <Calendar
//               mode="single"
//               selected={selectedDate}
//               onSelect={setSelectedDate}
//               initialFocus
//               className="p-3 pointer-events-auto"
//             />
//             <div className="border-t p-3 flex justify-between items-center">
//               <p className="text-sm text-muted-foreground">
//                 {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Aucune date sélectionnée'}
//               </p>
//               <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)}>
//                 Effacer
//               </Button>
//             </div>
//           </PopoverContent>
//         </Popover>
//       </div>

//       {showPassengers && selectedTrip && selectedVehicle ? (
//         // Affichage des voyageurs dans une table
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-semibold">
//               Voyageurs du trajet {selectedTrip.route_info.departure} - {selectedTrip.route_info.destination}
//             </h2>
//             <div className="space-x-2">
//               <Button onClick={generatePDF} variant="default">
//                 Enregistrer en PDF
//               </Button>
//               <Button onClick={handleBackToTrips} variant="outline">
//                 Retour
//               </Button>
//             </div>
//           </div>

//           {selectedTrip.vehicules.find((v) => v.vehicle_id === selectedVehicle)?.reservations?.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Nom</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Téléphone</TableHead>
//                   <TableHead>Places</TableHead>
//                   <TableHead>Statut</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {selectedTrip.vehicules.find((v) => v.vehicle_id === selectedVehicle)?.reservations.map((reservation) => (
//                   <TableRow key={reservation.voyageur_id}>
//                     <TableCell>
//                       <div className="font-medium">
//                         {reservation.voyageur_nom} {/* À remplacer par le nom réel si disponible */}
//                       </div>
//                     </TableCell>
//                     <TableCell>{reservation.voyageur_email}</TableCell>
//                     <TableCell>{reservation.voyageur_telephone}</TableCell>
//                     <TableCell>
//                       <Badge variant="outline">
//                         {reservation.nombre_places} {reservation.nombre_places > 1 ? 'places' : 'place'}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       {getStatusBadge(reservation.statut)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="text-center py-8">
//               <p className="text-muted-foreground">Aucun voyageur pour ce trajet.</p>
//             </div>
//           )}
//         </div>
//       ) : (
//         // Affichage des cartes des trajets
//         filteredReservations.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredReservations.map((reservation) => (
//               <Card key={reservation.trajet_id} className="overflow-hidden hover:shadow-md transition-shadow">
//                 <CardHeader className="bg-muted/50">
//                   <div className="mb-4">
//                     <div>
//                       <CardTitle className="text-xl flex items-center">
//                         <MapPin className="h-4 w-4 mr-2 text-travelcoop-500" />
//                         {reservation.route_info.departure} - {reservation.route_info.destination}
//                       </CardTitle>
//                     </div>
//                   </div>
//                   <div className='flex justify-between'>
//                         <CardDescription className="mt-1 flex items-center">
//                           <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
//                           {format(parseISO(reservation.date), 'dd MMMM yyyy', { locale: fr })}
//                         </CardDescription>
//                         <Badge className="bg-travelcoop-500">{formatMoney(reservation.prix)}</Badge>
//                   </div>
//                 </CardHeader>
                
//                 <CardContent className="pt-4">
//                   <div className="space-y-3">
//                     <div className="flex items-start">
//                       <Clock className="h-4 w-4 mr-2 text-travelcoop-500 mt-0.5" />
//                       <div>
//                         <p className="font-medium">Horaires</p>
//                         <p className="text-sm text-muted-foreground">
//                           Départ: {reservation.heure_depart} • Arrivée: {reservation.heure_arrivee}
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-start">
//                       <Bus className="h-4 w-4 mr-2 text-travelcoop-500 mt-0.5" />
//                       <div>
//                         <p className="font-medium">Véhicule(s)</p>
//                         <div className="text-sm text-muted-foreground">
//                           {reservation.vehicules.map((vehicle) => (
//                             <p key={vehicle.vehicle_id}>{vehicle.modele} ({vehicle.numero_immatriculation})</p>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
                
//                 <CardFooter className="border-t bg-muted/30 flex justify-end pt-3">
//                   {reservation.vehicules.map((vehicle) => (
//                     <Button 
//                       key={vehicle.vehicle_id} 
//                       variant="default" 
//                       size="sm" 
//                       className="flex items-center"
//                       onClick={() => handleTripClick(reservation, vehicle.vehicle_id)}
//                     >
//                       <Users className="h-4 w-4 mr-2" />
//                       Voir les voyageurs
//                     </Button>
//                   ))}
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-muted/20 border border-dashed rounded-md p-10 text-center">
//             <p className="text-lg text-muted-foreground">
//               {selectedDate ? 'Aucun trajet pour cette date.' : 'Aucun trajet disponible.'}
//             </p>
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default TripCards;


import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGroupedReservations } from '@/services/api';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Bus, 
  Users, 
  Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Définir les types
interface Vehicle {
  vehicule_id: string; // Changed from vehicle_id to match API
  numero_immatriculation: string;
  modele: string;
  capacite: number;
  reservations: Reservation[];
}

interface Reservation {
  voyageur_nom: string;
  voyageur_id: string;
  voyageur_email: string;
  voyageur_telephone: string;
  nombre_places: number;
  places: string[];
  statut: string;
  date_reservation: string;
}

interface GroupedReservationResponse {
  trajet_id: string;
  date: string;
  route_info: {
    departure: string;
    destination: string;
  };
  prix: number;
  heure_depart: string;
  heure_arrivee: string;
  vehicules: Vehicle[];
}

const TripCards = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTrip, setSelectedTrip] = useState<GroupedReservationResponse | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showPassengers, setShowPassengers] = useState(false);

  // Format selected date as string for filtering
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;

  // Fetch grouped reservations
  const { data: reservations, isLoading, error } = useQuery<GroupedReservationResponse[], Error>({
    queryKey: ['grouped-reservations', formattedDate],
    queryFn: async () => {
      const response = await getGroupedReservations(formattedDate);
      console.log('API response:', response);
      return response;
    },
    enabled: !!formattedDate || !selectedDate,
  });

  const handleTripClick = (trip: GroupedReservationResponse) => {
    console.log('handleTripClick triggered for trip:', trip.trajet_id);
    console.log('trip.vehicules:', trip.vehicules);
    
    if (!trip.vehicules || trip.vehicules.length === 0) {
      console.log('No vehicles available for this trip');
      setSelectedTrip(trip);
      setSelectedVehicle(null);
      setShowPassengers(true);
      return;
    }

    setSelectedTrip(trip);
    const firstVehicleId = trip.vehicules[0].vehicule_id;
    console.log('Setting selectedVehicle to:', firstVehicleId);
    setSelectedVehicle(firstVehicleId);
    setShowPassengers(true);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    console.log('handleVehicleSelect triggered for vehicle:', vehicleId);
    setSelectedVehicle(vehicleId);
  };

  const handleBackToTrips = () => {
    console.log('handleBackToTrips triggered');
    setSelectedTrip(null);
    setSelectedVehicle(null);
    setShowPassengers(false);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmee':
        return <Badge className="bg-green-500">Confirmé</Badge>;
      case 'en_attente':
        return <Badge className="bg-blue-500">En attente</Badge>;
      case 'annulé':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  // Générer un PDF des données des voyageurs
  const generatePDF = () => {
    if (!selectedTrip || !selectedVehicle) return;

    const doc = new jsPDF();
    const tableColumn = ["Nom", "Email", "Téléphone", "Places", "Statut"];
    const tableRows = [];

    const vehicleReservations = selectedTrip.vehicules.find((v) => v.vehicule_id === selectedVehicle)?.reservations || [];

    vehicleReservations.forEach(reservation => {
      const reservationData = [
        reservation.voyageur_nom,
        reservation.voyageur_email,
        reservation.voyageur_telephone,
        `${reservation.nombre_places} ${reservation.nombre_places > 1 ? 'places' : 'place'}`,
        reservation.statut
      ];
      tableRows.push(reservationData);
    });

    doc.text(`Voyageurs - Trajet: ${selectedTrip.route_info.departure} - ${selectedTrip.route_info.destination}`, 14, 15);
    doc.text(`Date: ${selectedTrip.date ? format(parseISO(selectedTrip.date), 'dd MMMM yyyy', { locale: fr }) : ''}`, 14, 25);
    doc.text(`Véhicule: ${selectedTrip.vehicules.find((v) => v.vehicule_id === selectedVehicle)?.modele || ''}`, 14, 35);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`voyageurs_trajet_${selectedTrip.trajet_id}_vehicule_${selectedVehicle}.pdf`);
  };

  // Filtrer les réservations par date sélectionnée
  const filteredReservations = reservations?.filter((reservation) => {
    if (!selectedDate) return true;
    return format(parseISO(reservation.date), 'yyyy-MM-dd') === formattedDate;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Erreur : {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réservations</h1>
          <p className="text-muted-foreground">
            Liste des trajets disponibles en blocs.
          </p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Filtrer par date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0 pointer-events-auto">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
            <div className="border-t p-3 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : 'Aucune date sélectionnée'}
              </p>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)}>
                Effacer
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {showPassengers && selectedTrip ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Voyageurs du trajet {selectedTrip.route_info.departure} - {selectedTrip.route_info.destination}
            </h2>
            <div className="space-x-2">
              {selectedVehicle && (
                <Button onClick={generatePDF} variant="default">
                  Enregistrer en PDF
                </Button>
              )}
              <Button onClick={handleBackToTrips} variant="outline">
                Retour
              </Button>
            </div>
          </div>

          {selectedTrip.vehicules.length > 0 ? (
            <>
              {/* Boutons pour chaque véhicule */}
              <div className="flex space-x-2">
                {selectedTrip.vehicules.map((vehicle) => (

                  <Button
                    key={vehicle.vehicule_id}
                    variant={selectedVehicle === vehicle.vehicule_id ? "default" : "outline"}
                    onClick={() => handleVehicleSelect(vehicle.vehicule_id)}
                  >
                    {vehicle.modele} ({vehicle.numero_immatriculation})
                  </Button>
                ))}
              </div>

              {selectedVehicle ? (
                (() => {
                  const selectedVehicleData = selectedTrip.vehicules.find((v) => v.vehicule_id === selectedVehicle);
                  console.log('Selected vehicle data:', selectedVehicleData);
                  console.log('Reservations for selected vehicle:', selectedVehicleData?.reservations);

                  if (!selectedVehicleData) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Véhicule non trouvé.</p>
                      </div>
                    );
                  }

                  if (selectedVehicleData.reservations?.length > 0) {
                    return (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>Places</TableHead>
                            <TableHead>Statut</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedVehicleData.reservations.map((reservation) => (
                            <TableRow key={reservation.voyageur_id}>
                              <TableCell>
                                <div className="font-medium">
                                  {reservation.voyageur_nom}
                                </div>
                              </TableCell>
                              <TableCell>{reservation.voyageur_email}</TableCell>
                              <TableCell>{reservation.voyageur_telephone}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {reservation.nombre_places} {reservation.nombre_places > 1 ? 'places' : 'place'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(reservation.statut)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    );
                  }

                  return (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucun voyageur pour ce véhicule.</p>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Veuillez sélectionner un véhicule.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun véhicule pour ce trajet.</p>
            </div>
          )}
        </div>
      ) : (
        filteredReservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.trajet_id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-muted/50">
                  <div className="mb-4">
                    <CardTitle className="text-xl flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-travelcoop-500" />
                      {reservation.route_info.departure} - {reservation.route_info.destination}
                    </CardTitle>
                  </div>
                  <div className='flex justify-between'>
                    <CardDescription className="mt-1 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      {format(parseISO(reservation.date), 'dd MMMM yyyy', { locale: fr })}
                    </CardDescription>
                    <Badge className="bg-travelcoop-500">{formatMoney(reservation.prix)}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 text-travelcoop-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Horaires</p>
                        <p className="text-sm text-muted-foreground">
                          Départ: {reservation.heure_depart}
                           {/* • Arrivée: {reservation.heure_arrivee} */}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Bus className="h-4 w-4 mr-2 text-travelcoop-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Véhicule(s)</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.vehicules.length} véhicule{reservation.vehicules.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t bg-muted/30 flex justify-end pt-3">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex items-center"
                    onClick={() => handleTripClick(reservation)}
                    disabled={reservation.vehicules.length === 0}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Voir les voyageurs
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/20 border border-dashed rounded-md p-10 text-center">
            <p className="text-lg text-muted-foreground">
              {selectedDate ? 'Aucun trajet pour cette date.' : 'Aucun trajet disponible.'}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default TripCards;
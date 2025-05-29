
// import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { format } from 'date-fns';
// import { Calendar as CalendarIcon, Filter, Users } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { DataTable } from '@/components/ui/data-table';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { cn } from '@/lib/utils';
// import { getReservations, getReservationsByTrip } from '@/services/api';
// import { ColumnDef } from '@tanstack/react-table';
// import { Reservation, Trip, Vehicle, Voyageur } from '@/types/models';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// const Reservations = () => {
//   const [date, setDate] = useState<Date | undefined>(undefined);
//   const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
//   const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  
//   const { data: reservations = [], isLoading } = useQuery({
//     queryKey: ['reservations', date ? format(date, 'yyyy-MM-dd') : 'all'],
//     queryFn: () => getReservations(date ? format(date, 'yyyy-MM-dd') : undefined)
//   });

//   const { data: sameTripsPassengers = [], isLoading: isLoadingPassengers } = useQuery({
//     queryKey: ['trip-passengers', selectedTrip, selectedVehicle],
//     queryFn: () => selectedTrip && selectedVehicle ? 
//                getReservationsByTrip(selectedTrip, selectedVehicle) : 
//                Promise.resolve([]),
//     enabled: !!selectedTrip && !!selectedVehicle
//   });

//   const columns: ColumnDef<Reservation>[] = [
//     {
//       accessorKey: 'reference',
//       header: 'Référence',
//     },
//     {
//       accessorKey: 'trajetDetails.date',
//       header: 'Date du voyage',
//       cell: ({ row }) => {
//         const trajet = row.original.trajetDetails;
//         if (!trajet) return 'N/A';
//         return format(new Date(trajet.date), 'dd/MM/yyyy');
//       },
//     },
//     {
//       accessorKey: 'trajetDetails.routeDetails',
//       header: 'Trajet',
//       cell: ({ row }) => {
//         const route = row.original.trajetDetails?.routeDetails;
//         if (!route) return 'N/A';
//         return `${route.departure} - ${route.destination}`;
//       }
//     },
//     {
//       accessorKey: 'voyageurDetails.nom',
//       header: 'Voyageur',
//       cell: ({ row }) => {
//         const voyageur = row.original.voyageurDetails;
//         if (!voyageur) return 'N/A';
//         return `${voyageur.nom} ${voyageur.prenom}`;
//       }
//     },
//     {
//       accessorKey: 'nombre_places',
//       header: 'Places',
//     },
//     {
//       accessorKey: 'statut',
//       header: 'Statut',
//       cell: ({ row }) => {
//         const statut = row.original.statut;
//         let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
        
//         switch(statut) {
//           case 'confirmé':
//             variant = 'default';
//             break;
//           case 'en_attente':
//             variant = 'secondary';
//             break;
//           case 'annulé':
//             variant = 'destructive';
//             break;
//         }
        
//         return <Badge variant={variant}>{statut}</Badge>;
//       }
//     },
//     {
//       accessorKey: 'date_reservation',
//       header: 'Date de réservation',
//       cell: ({ row }) => {
//         return format(new Date(row.original.date_reservation), 'dd/MM/yyyy HH:mm');
//       }
//     },
//     {
//       id: 'actions',
//       header: 'Actions',
//       cell: ({ row }) => {
//         const reservation = row.original;
//         const tripId = reservation.trajetid;
//         const vehicleId = reservation.vehicle_id;
        
//         return (
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button 
//                 variant="outline" 
//                 size="sm"
//                 onClick={() => {
//                   setSelectedTrip(tripId);
//                   setSelectedVehicle(vehicleId);
//                 }}
//               >
//                 <Users className="h-4 w-4 mr-2" />
//                 Voir voyageurs
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[625px]">
//               <DialogHeader>
//                 <DialogTitle>Voyageurs sur le même trajet</DialogTitle>
//                 <DialogDescription>
//                   Liste des voyageurs réservant le même trajet et véhicule
//                 </DialogDescription>
//               </DialogHeader>
              
//               {isLoadingPassengers ? (
//                 <div className="flex justify-center p-4">Chargement des voyageurs...</div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <h3 className="text-sm font-medium">Trajet:</h3>
//                     {reservation.trajetDetails?.routeDetails && (
//                       <p className="text-sm">
//                         {reservation.trajetDetails.routeDetails.departure} - {reservation.trajetDetails.routeDetails.destination} 
//                         ({format(new Date(reservation.trajetDetails.date), 'dd/MM/yyyy')})
//                       </p>
//                     )}
//                   </div>
                  
//                   <div className="space-y-2">
//                     <h3 className="text-sm font-medium">Véhicule:</h3>
//                     <p className="text-sm">
//                       {reservation.vehicleDetails?.modele} ({reservation.vehicleDetails?.numeroImmatriculation})
//                     </p>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <h3 className="text-sm font-medium">Liste des voyageurs:</h3>
//                     <div className="rounded-md border">
//                       <table className="w-full text-sm">
//                         <thead>
//                           <tr className="border-b">
//                             <th className="h-10 px-2 text-left font-medium">Nom</th>
//                             <th className="h-10 px-2 text-left font-medium">Prénom</th>
//                             <th className="h-10 px-2 text-left font-medium">Téléphone</th>
//                             <th className="h-10 px-2 text-left font-medium">Places</th>
//                             <th className="h-10 px-2 text-left font-medium">Status</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {sameTripsPassengers.map((res: Reservation) => (
//                             <tr key={res._id} className="border-b">
//                               <td className="p-2">{res.voyageurDetails?.nom}</td>
//                               <td className="p-2">{res.voyageurDetails?.prenom}</td>
//                               <td className="p-2">{res.voyageurDetails?.telephone}</td>
//                               <td className="p-2">{res.nombre_places}</td>
//                               <td className="p-2">
//                                 <Badge 
//                                   variant={
//                                     res.statut === 'confirmé' ? 'default' : 
//                                     res.statut === 'en_attente' ? 'secondary' : 'destructive'
//                                   }
//                                 >
//                                   {res.statut}
//                                 </Badge>
//                               </td>
//                             </tr>
//                           ))}
//                           {sameTripsPassengers.length === 0 && (
//                             <tr>
//                               <td colSpan={5} className="p-4 text-center">Aucun autre voyageur sur ce trajet</td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </DialogContent>
//           </Dialog>
//         );
//       }
//     }
//   ];

//   const resetDateFilter = () => {
//     setDate(undefined);
//   };

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold tracking-tight">Réservations</h1>
//         <div className="flex items-center gap-4">
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" className="flex items-center gap-2">
//                 <CalendarIcon className="h-4 w-4" />
//                 {date ? format(date, 'dd/MM/yyyy') : 'Filtrer par date'}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="end">
//               <Calendar
//                 mode="single"
//                 selected={date}
//                 onSelect={setDate}
//                 initialFocus
//                 className={cn("p-3 pointer-events-auto")}
//               />
//               <div className="p-2 border-t">
//                 <Button variant="ghost" size="sm" onClick={resetDateFilter} className="w-full">
//                   Réinitialiser
//                 </Button>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Gérer les Réservations</CardTitle>
//           <CardDescription>
//             Consultez et gérez toutes les réservations de trajets.
//             {date && (
//               <Badge variant="outline" className="ml-2">
//                 Filtré: {format(date, 'dd/MM/yyyy')}
//               </Badge>
//             )}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <DataTable
//             columns={columns}
//             data={reservations}
//             isLoading={isLoading}
//             filterColumn="reference"
//           />
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Reservations;


import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Filter, Users, PlusCircle, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getReservations, getReservationsByTrip, createReservation, updateReservation, deleteReservation } from '@/services/api';
import { ColumnDef } from '@tanstack/react-table';
import { Reservation, Trip, Vehicle, Voyageur } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Reservations = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [formData, setFormData] = useState({
    reference: '',
    trajetid: '',
    vehicle_id: '',
    voyageur_id: '', // Changed from voyageurDetails to voyageur_id
    nombre_places: 0,
    statut: 'en_attente' as const,
    date_reservation: new Date().toISOString(),
    // Removed trajetDetails and vehicleDetails from formData as they are fetched separately
  });

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['reservations', date ? format(date, 'yyyy-MM-dd') : 'all'],
    queryFn: () => getReservations(date ? format(date, 'yyyy-MM-dd') : undefined)
  });

  const { data: sameTripsPassengers = [], isLoading: isLoadingPassengers } = useQuery({
    queryKey: ['trip-passengers', selectedTrip, selectedVehicle],
    queryFn: () => selectedTrip && selectedVehicle ? 
               getReservationsByTrip(selectedTrip, selectedVehicle) : 
               Promise.resolve([]),
    enabled: !!selectedTrip && !!selectedVehicle
  });

  const createMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Réservation créée avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Réservation mise à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setIsDeleteDialogOpen(false);
      toast.success("Réservation supprimée avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const columns: ColumnDef<Reservation>[] = [
    {
      accessorKey: 'reference',
      header: 'Référence',
    },
    {
      accessorKey: 'trajetDetails.date',
      header: 'Date du voyage',
      cell: ({ row }) => {
        const trajet = row.original.trajetDetails;
        if (!trajet) return 'N/A';
        return format(new Date(trajet.date), 'dd/MM/yyyy');
      },
    },
    {
      accessorKey: 'trajetDetails.routeDetails',
      header: 'Trajet',
      cell: ({ row }) => {
        const route = row.original.trajetDetails?.routeDetails;
        if (!route) return 'N/A';
        return `${route.departure} - ${route.destination}`;
      }
    },
    {
      accessorKey: 'voyageurDetails.nom',
      header: 'Voyageur',
      cell: ({ row }) => {
        const voyageur = row.original.voyageurDetails;
        if (!voyageur) return 'N/A';
        return `${voyageur.nom} ${voyageur.prenom}`;
      }
    },
    {
      accessorKey: 'nombre_places',
      header: 'Places',
    },
    {
      accessorKey: 'statut',
      header: 'Statut',
      cell: ({ row }) => {
        const statut = row.original.statut;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
        
        switch(statut) {
          case 'confirmé':
            variant = 'default';
            break;
          case 'en_attente':
            variant = 'secondary';
            break;
          case 'annulé':
            variant = 'destructive';
            break;
        }
        
        return <Badge variant={variant}>{statut}</Badge>;
      }
    },
    {
      accessorKey: 'date_reservation',
      header: 'Date de réservation',
      cell: ({ row }) => {
        return format(new Date(row.original.date_reservation), 'dd/MM/yyyy HH:mm');
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const reservation = row.original;

        return (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleEdit(reservation)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </Button>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(reservation)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                    Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button 
                    variant="destructive" 
                    onChange={handleConfirmDelete}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "En cours..." : "Supprimer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      }
    }
  ];

  const resetDateFilter = () => {
    setDate(undefined);
  };

  const resetForm = () => {
    setFormData({
      reference: '',
      trajetid: '',
      vehicle_id: '',
      voyageur_id: '', // Reset to empty string instead of object
      nombre_places: 0,
      statut: 'en_attente',
      date_reservation: new Date().toISOString(),
    });
    setSelectedReservation(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nombre_places' || name === 'trajetid' || name === 'vehicle_id' || name === 'voyageur_id' ? Number(value) || value : value,
    }));
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setFormData({
      reference: reservation.reference,
      trajetid: reservation.trajetid,
      vehicle_id: reservation.vehicle_id,
      voyageur_id: reservation.voyageur_id, // Use voyageur_id instead of voyageurDetails
      nombre_places: reservation.nombre_places,
      statut: reservation.statut,
      date_reservation: reservation.date_reservation,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedReservation) {
      deleteMutation.mutate(selectedReservation._id);
    }
  };

  const handleSubmitAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedReservation) {
      updateMutation.mutate({
        _id: selectedReservation._id,
        ...formData,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Réservations</h1>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, 'dd/MM/yyyy') : 'Filtrer par date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" onClick={resetDateFilter} className="w-full">
                  Réinitialiser
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter une réservation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle réservation</DialogTitle>
                <DialogDescription>
                  Créez une nouvelle réservation dans le système.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitAdd}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reference">Référence</Label>
                    <Input
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="trajetid">ID du trajet</Label>
                    <Input
                      id="trajetid"
                      name="trajetid"
                      type="text" // Changed to text since trajetid is a string in the interface
                      value={formData.trajetid}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vehicle_id">ID du véhicule</Label>
                    <Input
                      id="vehicle_id"
                      name="vehicle_id"
                      type="text" // Changed to text since vehicle_id is a string in the interface
                      value={formData.vehicle_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="voyageur_id">ID du voyageur</Label>
                    <Input
                      id="voyageur_id"
                      name="voyageur_id"
                      type="text" // Changed to text since voyageur_id is a string in the interface
                      value={formData.voyageur_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nombre_places">Nombre de places</Label>
                    <Input
                      id="nombre_places"
                      name="nombre_places"
                      type="number"
                      min="1"
                      value={formData.nombre_places}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="statut">Statut</Label>
                    <select
                      id="statut"
                      name="statut"
                      value={formData.statut}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="en_attente">En attente</option>
                      <option value="confirmé">Confirmé</option>
                      <option value="annulé">Annulé</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "En cours..." : "Ajouter"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gérer les Réservations</CardTitle>
          <CardDescription>
            Consultez et gérez toutes les réservations de trajets.
            {date && (
              <Badge variant="outline" className="ml-2">
                Filtré: {format(date, 'dd/MM/yyyy')}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={reservations}
            isLoading={isLoading}
            filterColumn="reference"
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la réservation</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la réservation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-reference">Référence</Label>
                <Input
                  id="edit-reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-nombre_places">Nombre de places</Label>
                <Input
                  id="edit-nombre_places"
                  name="nombre_places"
                  type="number"
                  min="1"
                  value={formData.nombre_places}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-statut">Statut</Label>
                <select
                  id="edit-statut"
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="en_attente">En attente</option>
                  <option value="confirmé">Confirmé</option>
                  <option value="annulé">Annulé</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "En cours..." : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "En cours..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reservations;
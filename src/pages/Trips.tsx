import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrips, deleteTrip, createTrip, updateTrip, getRoutes, getVehicules, getCooperatives, getCooperativeById, getRouteById, getVehiculeById } from '@/services/api';
import { Button } from '@/components/ui/button';
import { RouteDetails, VehiculeDetails, CooperativeDetails, Trajet, Route, Vehicule, Cooperative } from '@/types/models';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { PlusCircle, Trash, Pencil, Calendar, MapPin, Clock, Bus } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

// Composant pour la sélection multiple
const MultiSelect = ({ options, value, onChange, placeholder }: { options: Vehicule[], value: string[], onChange: (values: string[]) => void, placeholder: string }) => {
  const [selected, setSelected] = useState<string[]>(value);

  const handleToggle = (vehiculeId: string) => {
    const newSelected = selected.includes(vehiculeId)
      ? selected.filter(id => id !== vehiculeId)
      : [...selected, vehiculeId];
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <Select onValueChange={(val) => handleToggle(val)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {selected.length > 0 ? selected.map(id => options.find(v => v.vehicule_id === id)?.modele).join(', ') : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((vehicule) => (
          <SelectItem key={vehicule.vehicule_id} value={vehicule.vehicule_id}>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selected.includes(vehicule.vehicule_id)}
                onChange={() => handleToggle(vehicule.vehicule_id)}
                className="mr-2"
              />
              {vehicule.modele}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const Trips = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trajet | null>(null);
  const [formData, setFormData] = useState({
    trajet_id: '',
    route_id: '',
    prix: 0,
    heure_de_depart: '',
    heure_d_arrivee: '',
    date: '',
    vehicule_id: [] as string[],
    cooperative_id: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDisplayValues, setSelectedDisplayValues] = useState({
    route_id: 'Sélectionner',
    cooperative_id: 'Sélectionner',
    vehicule_id: [] as string[]
  });

  const { data: trips, isLoading: isLoadingTrips } = useQuery<Trajet[]>({
    queryKey: ['trips'],
    queryFn: getTrips
  });

  const { data: routes, isLoading: isLoadingRoutes } = useQuery<Route[]>({
    queryKey: ['routes'],
    queryFn: getRoutes
  });

  const { data: vehicules, isLoading: isLoadingVehicules } = useQuery<Vehicule[]>({
    queryKey: ['vehicules'],
    queryFn: getVehicules
  });

  const { data: cooperatives, isLoading: isLoadingCooperatives } = useQuery<Cooperative[]>({
    queryKey: ['cooperatives'],
    queryFn: getCooperatives
  });

  const createMutation = useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Trajet ajouté avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Trajet>) => updateTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Trajet mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      setIsDeleteDialogOpen(false);
      toast.success("Trajet supprimé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const resetForm = () => {
    setFormData({
      trajet_id: '',
      route_id: '',
      prix: 0,
      heure_de_depart: '',
      heure_d_arrivee: '',
      date: '',
      vehicule_id: [],
      cooperative_id: ''
    });
    setSelectedDate(undefined);
    setSelectedTrip(null);
    setSelectedDisplayValues({
      route_id: 'Sélectionner',
      cooperative_id: 'Sélectionner',
      vehicule_id: []
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'prix' ? Number(value) : value 
    }));
  };

  // Fonction synchrone pour obtenir les valeurs d'affichage
  const getDisplayValueSync = (id: string, type: 'route' | 'cooperative' | 'vehicule'): string => {
    if (!id) return 'Sélectionner';
    try {
      switch (type) {
        case 'route':
          const route = routes?.find(r => r.route_id === id);
          return route ? `${route.departure} - ${route.destination}` : 'Itinéraire non trouvé';
        case 'cooperative':
          const coop = cooperatives?.find(c => c.cooperative_id === id);
          return coop ? coop.name : 'Coopérative non trouvée';
        case 'vehicule':
          const vehicule = vehicules?.find(v => v.vehicule_id === id);
          return vehicule ? vehicule.modele : 'Véhicule non trouvé';
        default:
          return 'Sélectionner';
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails pour ${type}:`, error);
      return 'Erreur de chargement';
    }
  };

  // Fonction synchrone pour handleSelectChange
  const handleSelectChange = (field: string) => (value: string) => {
    let displayValue: string = 'Sélectionner';

    switch (field) {
      case 'route_id':
        displayValue = getDisplayValueSync(value, 'route');
        break;
      case 'cooperative_id':
        displayValue = getDisplayValueSync(value, 'cooperative');
        break;
      case 'vehicule_id':
        console.warn("La sélection multiple pour vehicule_id devrait utiliser MultiSelect, pas Select.");
        return; // Ne devrait pas être utilisé ici
      default:
        displayValue = 'Sélectionner';
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setSelectedDisplayValues(prev => ({
      ...prev,
      [field]: field === 'vehicule_id' ? prev.vehicule_id : displayValue
    }));
  };

  // Gestion spécifique pour MultiSelect
  const handleMultiSelectChange = (values: string[]) => {
    setFormData(prev => ({
      ...prev,
      vehicule_id: values
    }));

    const displayValues = values.map(id => getDisplayValueSync(id, 'vehicule'));
    setSelectedDisplayValues(prev => ({
      ...prev,
      vehicule_id: displayValues
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    } else {
      setFormData(prev => ({ ...prev, date: '' }));
    }
  };

  const handleEdit = (trip: Trajet) => {
    setSelectedTrip(trip);
    setFormData({
      trajet_id: trip.trajet_id || '',
      route_id: trip.route_id || '',
      prix: trip.prix || 0,
      heure_de_depart: trip.heure_de_depart || '',
      heure_d_arrivee: trip.heure_d_arrivee || '',
      date: trip.date || '',
      vehicule_id: trip.vehicule_id || [],
      cooperative_id: trip.cooperative_id || ''
    });

    setSelectedDisplayValues({
      route_id: trip.route_id ? getDisplayValueSync(trip.route_id, 'route') : 'Sélectionner',
      cooperative_id: trip.cooperative_id ? getDisplayValueSync(trip.cooperative_id, 'cooperative') : 'Sélectionner',
      vehicule_id: trip.vehicule_id.map(id => getDisplayValueSync(id, 'vehicule'))
    });

    if (trip.date) {
      try {
        setSelectedDate(parseISO(trip.date));
      } catch (error) {
        console.error("Date parsing error:", error);
        setSelectedDate(undefined);
      }
    } else {
      setSelectedDate(undefined);
    }
    setIsEditDialogOpen(true);
  };

  const handleDelete = (trip: Trajet) => {
    setSelectedTrip(trip);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      route_id: formData.route_id,
      prix: formData.prix,
      heure_de_depart: formData.heure_de_depart,
      heure_d_arrivee: formData.heure_d_arrivee,
      date: formData.date,
      vehicule_id: formData.vehicule_id,
      cooperative_id: formData.cooperative_id
    };
    createMutation.mutate(payload);
  };

  const handleSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTrip) {
      const payload = {
        trajet_id: selectedTrip.trajet_id,
        route_id: formData.route_id,
        prix: formData.prix,
        heure_de_depart: formData.heure_de_depart,
        heure_d_arrivee: formData.heure_d_arrivee,
        date: formData.date,
        vehicule_id: formData.vehicule_id,
        cooperative_id: formData.cooperative_id
      };
      updateMutation.mutate(payload);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedTrip && selectedTrip.trajet_id) {
      deleteMutation.mutate(selectedTrip.trajet_id);
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const columns: ColumnDef<Trajet>[] = [
    {
      accessorKey: 'route',
      header: 'Itinéraire',
      cell: ({ row }) => {
        const trip = row.original;
        const routeDetails = trip.route_details;
        return (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-travelcoop-500" />
            <div>
              <div className="font-medium">{routeDetails?.departure} - {routeDetails?.destination}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = row.original.date;
        try {
          return (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-travelcoop-500" />
              <span>{format(parseISO(date), 'dd MMMM yyyy', { locale: fr })}</span>
            </div>
          );
        } catch (error) {
          return <span>{date || 'Date invalide'}</span>;
        }
      },
    },
    {
      accessorKey: 'time',
      header: 'Horaires',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-travelcoop-500" />
          <div>
            <div>Départ: {row.original.heure_de_depart}</div>
            {/* <div>Arrivée: {row.original.heure_d_arrivee}</div> */}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'cooperative',
      header: 'Coopérative',
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <div className="flex items-center">
            <span>{trip.cooperative_details?.name || 'N/A'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'vehicule',
      header: 'Véhicule',
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <div className="flex items-center">
            <Bus className="h-4 w-4 mr-2 text-travelcoop-500" />
            <div>
              {trip.vehicule_details?.map((v: VehiculeDetails) => v.modele).join(', ') || 'N/A'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'prix',
      header: 'Prix',
      cell: ({ row }) => (
        <div className="font-medium">{formatMoney(row.original.prix)}</div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const trip = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(trip)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(trip)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trajets</h1>
          <p className="text-muted-foreground">
            Gérez tous les trajets et horaires des coopératives.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                if (!routes || !cooperatives || !vehicules) {
                  toast.error("Veuillez attendre que les données soient chargées.");
                  return;
                }
                resetForm();
                setIsAddDialogOpen(true);
              }}
              disabled={isLoadingTrips || isLoadingRoutes || isLoadingCooperatives || isLoadingVehicules}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un trajet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau trajet</DialogTitle>
              <DialogDescription>
                Créez un nouveau trajet avec itinéraire, horaires et prix.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid gap-4 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="route_id">Itinéraire</Label>
                    <Select 
                      value={formData.route_id} 
                      onValueChange={handleSelectChange('route_id')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un itinéraire">
                          {selectedDisplayValues.route_id}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                       {routes?.map((route: Route) => (
                          <SelectItem key={route.route_id} value={route.route_id}>
                            {`${route.departure} - ${route.destination}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cooperative_id">Coopérative</Label>
                    <Select 
                      value={formData.cooperative_id} 
                      onValueChange={handleSelectChange('cooperative_id')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une coopérative">
                          {selectedDisplayValues.cooperative_id}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {cooperatives?.map((coop: Cooperative) => (
                          <SelectItem key={coop.cooperative_id} value={coop.cooperative_id}>
                            {coop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Date de départ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="heure_de_depart">Heure de départ</Label>
                    <Input
                      id="heure_de_depart"
                      name="heure_de_depart"
                      type="time"
                      value={formData.heure_de_depart}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* <div className="grid gap-2">
                    <Label htmlFor="heure_d_arrivee">Heure d'arrivée</Label>
                    <Input
                      id="heure_d_arrivee"
                      name="heure_d_arrivee"
                      type="time"
                      value={formData.heure_d_arrivee}
                      onChange={handleInputChange}
                      required
                    />
                  </div> */}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="prix">Prix (MGA)</Label>
                    <Input
                      id="prix"
                      name="prix"
                      type="number"
                      min="0"
                      value={formData.prix}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vehicule_id">Véhicules</Label>
                    <MultiSelect
                      options={vehicules || []}
                      value={formData.vehicule_id}
                      onChange={handleMultiSelectChange}
                      placeholder="Sélectionner des véhicules"
                    />
                  </div>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le trajet</DialogTitle>
            <DialogDescription>
              Modifiez les informations du trajet.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="route_id">Itinéraire</Label>
                  <Select 
                    value={formData.route_id} 
                    onValueChange={handleSelectChange('route_id')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un itinéraire">
                        {selectedDisplayValues.route_id}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {routes?.map((route: Route) => (
                        <SelectItem key={route.route_id} value={route.route_id}>
                          {`${route.departure} - ${route.destination}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cooperative_id">Coopérative</Label>
                  <Select 
                    value={formData.cooperative_id} 
                    onValueChange={handleSelectChange('cooperative_id')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une coopérative">
                        {selectedDisplayValues.cooperative_id}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {cooperatives?.map((coop: Cooperative) => (
                        <SelectItem key={coop.cooperative_id} value={coop.cooperative_id}>
                          {coop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Date de départ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="heure_de_depart">Heure de départ</Label>
                  <Input
                    id="heure_de_depart"
                    name="heure_de_depart"
                    type="time"
                    value={formData.heure_de_depart}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="heure_d_arrivee">Heure d'arrivée</Label>
                  <Input
                    id="heure_d_arrivee"
                    name="heure_d_arrivee"
                    type="time"
                    value={formData.heure_d_arrivee}
                    onChange={handleInputChange}
                    required
                  />
                </div> */}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="prix">Prix (MGA)</Label>
                  <Input
                    id="prix"
                    name="prix"
                    type="number"
                    min="0"
                    value={formData.prix}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vehicule_id">Véhicules</Label>
                  <MultiSelect
                    options={vehicules || []}
                    value={formData.vehicule_id}
                    onChange={handleMultiSelectChange}
                    placeholder="Sélectionner des véhicules"
                  />
                </div>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible.
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

      <DataTable
        columns={columns}
        data={trips || []}
        isLoading={isLoadingTrips}
        filterColumn="destination"
      />
    </div>
  );
};

export default Trips;
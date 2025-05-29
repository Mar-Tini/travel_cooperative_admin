
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoutes, createRoute, updateRoute, deleteRoute } from '@/services/api';
import { Route as RouteModel } from '@/types/models';
import { Button } from '@/components/ui/button';
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
import { PlusCircle, Trash, Pencil, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const RoutesPage = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteModel | null>(null);
  const [formData, setFormData] = useState({
    province: import.meta.env.VITE_PROVINCE,
    departure: import.meta.env.VITE_DEPARTURE,
    destination: '',
    route: '',
    distance_km: 0, 
    route_id: ''
  });

  const { data: routes, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: getRoutes
  });

  const createMutation = useMutation({
    mutationFn: createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Route ajoutée avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Route mise à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (route_id: string) => deleteRoute(route_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setIsDeleteDialogOpen(false);
      toast.success("Route supprimée avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const resetForm = () => {
    setFormData({
      province: import.meta.env.VITE_PROVINCE,
      departure: import.meta.env.VITE_DEPARTURE,
      destination: '',
      route: '',
      distance_km: 0,
      route_id: '', 
    });
    setSelectedRoute(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'distance_km' ? Number(value) : value 
    }));
  };

  const handleEdit = (route: RouteModel) => {
    setSelectedRoute(route);
    setFormData({
      province: route.province,
      departure: route.departure,
      destination: route.destination,
      route: route.route,
      distance_km: route.distance_km , 
      route_id: route.route_id
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (route: RouteModel) => {
    setSelectedRoute(route);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedRoute) {
      const filteredData = {
        ...formData,
      };
      updateMutation.mutate({
        route_id: selectedRoute.route_id, // Remplacé _id par vehicule_id
        ...filteredData
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedRoute) {
      deleteMutation.mutate(selectedRoute.route_id);
    }
  };

  const columns: ColumnDef<RouteModel>[] = [
    {
      accessorKey: 'departure',
      header: 'Départ',
    },
    {
      accessorKey: 'destination',
      header: 'Destination',
    },
    {
      accessorKey: 'route',
      header: 'Route',
      cell: ({ row }) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-travelcoop-500" />
          <span>{row.original.route}</span>
        </div>
      ),
    },
    {
      accessorKey: 'province',
      header: 'Province',
    },
    {
      accessorKey: 'distance_km',
      header: 'Distance (km)',
      cell: ({ row }) => (
        <div>{row.original.distance_km} km</div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Routes</h1>
          <p className="text-muted-foreground">
              Gérez toutes les routes disponibles pour les trajets.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une route
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle route</DialogTitle>
              <DialogDescription>
                Créez une nouvelle route dans le système.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    name="province"
                    placeholder="Province"
                    value={formData.province}
                    onChange={handleInputChange}
                    readOnly
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="departure">Ville de départ</Label>
                  <Input
                    id="departure"
                    name="departure"
                    placeholder="Ville de départ"
                    value={formData.departure}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="destination">Ville de destination</Label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="Ville de destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="route">Code de route</Label>
                  <Input
                    id="route"
                    name="route"
                    placeholder="Ex: RN7, RN4"
                    value={formData.route}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="distance_km">Distance (km)</Label>
                  <Input
                    id="distance_km"
                    name="distance_km"
                    type="number"
                    min="0"
                    placeholder="Distance en kilomètres"
                    value={formData.distance_km}
                    onChange={handleInputChange}
                    required
                  />
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la route</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la route.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-province">Province</Label>
                <Input
                  id="edit-province"
                  name="province"
                  placeholder="Province"
                  value={formData.province}
                  onChange={handleInputChange}
                  readOnly
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-departure">Ville de départ</Label>
                <Input
                  id="edit-departure"
                  name="departure"
                  placeholder="Ville de départ"
                  value={formData.departure}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-destination">Ville de destination</Label>
                <Input
                  id="edit-destination"
                  name="destination"
                  placeholder="Ville de destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-route">Code de route</Label>
                <Input
                  id="edit-route"
                  name="route"
                  placeholder="Ex: RN7, RN4"
                  value={formData.route}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-distance_km">Distance (km)</Label>
                <Input
                  id="edit-distance_km"
                  name="distance_km"
                  type="number"
                  min="0"
                  placeholder="Distance en kilomètres"
                  value={formData.distance_km}
                  onChange={handleInputChange}
                  required
                />
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
              Êtes-vous sûr de vouloir supprimer cette route ? Cette action est irréversible.
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={routes || []}
        isLoading={isLoading}
        filterColumn="destination"
      />
    </div>
  );
};

export default RoutesPage;

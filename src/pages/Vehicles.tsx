import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicules_touts, createVehicule, updateVehicule, deleteVehicule } from '@/services/api';
import { Vehicule } from '@/types/models';
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
import { PlusCircle, Trash, Pencil, Tag, Car } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Vehicules = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(null);
  const [formData, setFormData] = useState({
    modele: '',
    capacite: 18,
    numeroImmatriculation: '',
    equipements: [''],
    etat: 'disponible', 
    vehicule_id: '' // Remplacé _id par vehicule_id
  });
  const [newEquipement, setNewEquipement] = useState('');

  const { data: vehicules, isLoading } = useQuery({
    queryKey: ['vehicules'],
    queryFn: getVehicules_touts
  });

  const createMutation = useMutation({
    mutationFn: createVehicule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicules'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Véhicule ajouté avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateVehicule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicules'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Véhicule mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (vehicule_id: string) => deleteVehicule(vehicule_id), // Mis à jour pour vehicule_id
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicules'] });
      setIsDeleteDialogOpen(false);
      toast.success("Véhicule supprimé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });

  const resetForm = () => {
    setFormData({
      modele: '',
      capacite: 18,
      numeroImmatriculation: '',
      equipements: [''],
      etat: 'disponible', 
      vehicule_id: '' // Remplacé _id par vehicule_id
    });
    setNewEquipement('');
    setSelectedVehicule(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacite' ? Number(value) : value 
    }));
  };

  const handleEtatChange = (value: string) => {
    setFormData(prev => ({ ...prev, etat: value }));
  };

  const handleEquipementChange = (index: number, value: string) => {
    const newEquipements = [...formData.equipements];
    newEquipements[index] = value;
    setFormData(prev => ({ ...prev, equipements: newEquipements }));
  };

  const handleAddEquipement = () => {
    if (newEquipement.trim() !== '') {
      setFormData(prev => ({ 
        ...prev, 
        equipements: [...prev.equipements.filter(e => e !== ''), newEquipement] 
      }));
      setNewEquipement('');
    }
  };

  const handleRemoveEquipement = (index: number) => {
    const newEquipements = [...formData.equipements];
    newEquipements.splice(index, 1);
    setFormData(prev => ({ ...prev, equipements: newEquipements }));
  };

  const handleEdit = (vehicule: Vehicule) => {
    setSelectedVehicule(vehicule);
    setFormData({
      modele: vehicule.modele,
      capacite: vehicule.capacite,
      numeroImmatriculation: vehicule.numeroImmatriculation,
      equipements: [...vehicule.equipements],
      etat: vehicule.etat, 
      vehicule_id: vehicule.vehicule_id // Remplacé _id par vehicule_id
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (vehicule: Vehicule) => {
    setSelectedVehicule(vehicule);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filteredData = {
      ...formData,
      equipements: formData.equipements.filter(e => e.trim() !== '')
    };
    createMutation.mutate(filteredData);
  };

  const handleSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedVehicule) {
      const filteredData = {
        ...formData,
        equipements: formData.equipements.filter(e => e.trim() !== '')
      };
      updateMutation.mutate({
        vehicule_id: selectedVehicule.vehicule_id, // Remplacé _id par vehicule_id
        ...filteredData
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedVehicule) {
      deleteMutation.mutate(selectedVehicule.vehicule_id); // Remplacé _id par vehicule_id
    }
  };

  const columns: ColumnDef<Vehicule>[] = [
    {
      accessorKey: 'modele',
      header: 'Modèle',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Car className="h-4 w-4 mr-2 text-travelcoop-500" />
          <div className="font-medium">{row.original.modele}</div>
        </div>
      ),
    },
    {
      accessorKey: 'numeroImmatriculation',
      header: 'Immatriculation',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>{row.original.numeroImmatriculation}</span>
        </div>
      ),
    },
    {
      accessorKey: 'capacite',
      header: 'Capacité',
      cell: ({ row }) => (
        <div>{row.original.capacite} places</div>
      ),
    },
    {
      accessorKey: 'equipements',
      header: 'Équipements',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.equipements.map((equipement, i) => (
            <Badge key={i} variant="outline">{equipement}</Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'etat',
      header: 'État',
      cell: ({ row }) => {
        const etat = row.original.etat;
        let badgeClass = "bg-green-100 text-green-800";
        
        if (etat === 'maintenance') {
          badgeClass = "bg-amber-100 text-amber-800";
        } else if (etat === 'indisponible') {
          badgeClass = "bg-red-100 text-red-800";
        }
        
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
            {etat}
          </span>
        );
      },
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
          <h1 className="text-3xl font-bold tracking-tight">Véhicules</h1>
          <p className="text-muted-foreground">
            Gérez tous vos véhicules disponibles pour les trajets.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
              <DialogDescription>
                Créez un nouveau véhicule dans le système.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="modele">Modèle</Label>
                  <Input
                    id="modele"
                    name="modele"
                    placeholder="Modèle du véhicule"
                    value={formData.modele}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacite">Capacité</Label>
                  <Input
                    id="capacite"
                    name="capacite"
                    type="number"
                    min="0"
                    placeholder="Nombre de places"
                    value={formData.capacite}
                    onChange={handleInputChange}
                    readOnly
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="numeroImmatriculation">Numéro d'immatriculation</Label>
                  <Input
                    id="numeroImmatriculation"
                    name="numeroImmatriculation"
                    placeholder="Numéro d'immatriculation"
                    value={formData.numeroImmatriculation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>État</Label>
                  <Select 
                    value={formData.etat} 
                    onValueChange={handleEtatChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="maintenance">En maintenance</SelectItem>
                      <SelectItem value="indisponible">Indisponible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Équipements</Label>
                  <div className="space-y-2">
                    {formData.equipements.filter(e => e.trim() !== '').map((equipement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={equipement}
                          onChange={(e) => handleEquipementChange(index, e.target.value)}
                          placeholder="Nom de l'équipement"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveEquipement(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newEquipement}
                        onChange={(e) => setNewEquipement(e.target.value)}
                        placeholder="Ajouter un équipement"
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddEquipement}
                      >
                        Ajouter
                      </Button>
                    </div>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le véhicule</DialogTitle>
            <DialogDescription>
              Modifiez les informations du véhicule.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-modele">Modèle</Label>
                <Input
                  id="edit-modele"
                  name="modele"
                  placeholder="Modèle du véhicule"
                  value={formData.modele}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-capacite">Capacité</Label>
                <Input
                  id="edit-capacite"
                  name="capacite"
                  type="number"
                  min="0"
                  placeholder="Nombre de places"
                  value={formData.capacite}
                  onChange={handleInputChange}
                  readOnly
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-numeroImmatriculation">Numéro d'immatriculation</Label>
                <Input
                  id="edit-numeroImmatriculation"
                  name="numeroImmatriculation"
                  placeholder="Numéro d'immatriculation"
                  value={formData.numeroImmatriculation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>État</Label>
                <Select 
                  value={formData.etat} 
                  onValueChange={handleEtatChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un état" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="maintenance">En maintenance</SelectItem>
                    <SelectItem value="indisponible">Indisponible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Équipements</Label>
                <div className="space-y-2">
                  {formData.equipements.filter(e => e.trim() !== '').map((equipement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={equipement}
                        onChange={(e) => handleEquipementChange(index, e.target.value)}
                        placeholder="Nom de l'équipement"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveEquipement(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newEquipement}
                      onChange={(e) => setNewEquipement(e.target.value)}
                      placeholder="Ajouter un équipement"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddEquipement}
                    >
                      Ajouter
                    </Button>
                  </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
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
        data={vehicules || []}
        isLoading={isLoading}
        filterColumn="modele"
      />
    </div>
  );
};

export default Vehicules;
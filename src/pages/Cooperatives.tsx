// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getCooperatives, createCooperative, updateCooperative, deleteCooperative } from '@/services/api';
// import { Cooperative, CooperativeCreate } from '@/types/models';
// import { Button } from '@/components/ui/button';
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogDescription, 
//   DialogFooter, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogTrigger 
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { DataTable } from '@/components/ui/data-table';
// import { ColumnDef } from '@tanstack/react-table';
// import { PlusCircle, Trash, Pencil, Check, Ban } from 'lucide-react';
// import { toast } from 'sonner';

// const Cooperatives: React.FC = () => {
//   const queryClient = useQueryClient();
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedCooperative, setSelectedCooperative] = useState<Cooperative | null>(null);
//   const [formData, setFormData] = useState<Partial<CooperativeCreate>>({
//     name: '',
//     description: '',
//     contact_email: '',
//     contact_phone: '',
//     logo_url: '',
//     active: true,
//   });

//   const { data: cooperatives, isLoading, error } = useQuery<Cooperative[], Error>({
//     queryKey: ['cooperatives'],
//     queryFn: getCooperatives,
//   });

//   const createMutation = useMutation({
//     mutationFn: (newCooperative: CooperativeCreate) => createCooperative(newCooperative),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['cooperatives'] });
//       setIsAddDialogOpen(false);
//       resetForm();
//       toast.success("Coopérative ajoutée avec succès");
//     },
//     onError: (error) => {
//       toast.error(`Erreur lors de l'ajout: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: (updatedCooperative: { cooperative_id: string } & Partial<CooperativeCreate>) => 
//       updateCooperative(updatedCooperative),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['cooperatives'] });
//       setIsEditDialogOpen(false);
//       resetForm();
//       toast.success("Coopérative mise à jour avec succès");
//     },
//     onError: (error) => {
//       toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (cooperative_id: string) => deleteCooperative(cooperative_id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['cooperatives'] });
//       setIsDeleteDialogOpen(false);
//       toast.success("Coopérative supprimée avec succès");
//     },
//     onError: (error) => {
//       toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
//     },
//   });

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       description: '',
//       contact_email: '',
//       contact_phone: '',
//       logo_url: '',
//       active: true,
//     });
//     setSelectedCooperative(null);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSwitchChange = (checked: boolean) => {
//     setFormData(prev => ({ ...prev, active: checked }));
//   };

//   const handleEdit = (cooperative: Cooperative) => {
//     setSelectedCooperative(cooperative);
//     setFormData({
//       name: cooperative.name,
//       description: cooperative.description,
//       contact_email: cooperative.contact_email,
//       contact_phone: cooperative.contact_phone,
//       logo_url: cooperative.logo_url,
//       active: cooperative.active,
//     });
//     setIsEditDialogOpen(true);
//   };

//   const handleDelete = (cooperative: Cooperative) => {
//     setSelectedCooperative(cooperative);
//     setIsDeleteDialogOpen(true);
//   };

//   const handleSubmitAdd = (e: React.FormEvent) => {
//     e.preventDefault();
//     createMutation.mutate({ ...formData, name: formData.name || '', description: formData.description || '', contact_email: formData.contact_email || '', contact_phone: formData.contact_phone || '', logo_url: formData.logo_url || '', active: formData.active || true } as CooperativeCreate);
//   };

//   const handleSubmitEdit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (selectedCooperative) {
//       updateMutation.mutate({
//         cooperative_id: selectedCooperative.cooperative_id,
//         ...formData,
//       });
//     }
//   };

//   const handleConfirmDelete = () => {
//     if (selectedCooperative) {
//       deleteMutation.mutate(selectedCooperative.cooperative_id);
//     }
//   };

//   const columns: ColumnDef<Cooperative>[] = [
//     {
//       accessorKey: 'name',
//       header: 'Nom',
//       cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
//     },
//     {
//       accessorKey: 'contact_email',
//       header: 'Email',
//     },
//     {
//       accessorKey: 'contact_phone',
//       header: 'Téléphone',
//     },
//     {
//       accessorKey: 'active',
//       header: 'Statut',
//       cell: ({ row }) => (
//         <div className="flex items-center">
//           {row.original.active ? (
//             <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
//               <Check className="h-3 w-3 mr-1" /> Actif
//             </span>
//           ) : (
//             <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
//               <Ban className="h-3 w-3 mr-1" /> Inactif
//             </span>
//           )}
//         </div>
//       ),
//     },
//     {
//       id: 'actions',
//       cell: ({ row }) => (
//         <div className="flex gap-2">
//           <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
//             <Pencil className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}>
//             <Trash className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-8 p-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Coopératives</h1>
//           <p className="text-muted-foreground">
//             Gérez toutes vos coopératives partenaires ici.
//           </p>
//         </div>
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={() => {
//               resetForm();
//               setIsAddDialogOpen(true);
//             }}>
//               <PlusCircle className="h-4 w-4 mr-2" />
//               Ajouter une coopérative
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Ajouter une nouvelle coopérative</DialogTitle>
//               <DialogDescription>
//                 Créez une nouvelle coopérative partenaire dans le système.
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleSubmitAdd}>
//               <div className="grid gap-4 py-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="name">Nom</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     placeholder="Nom de la coopérative"
//                     value={formData.name || ''}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     placeholder="Description de la coopérative"
//                     value={formData.description || ''}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="contact_email">Email</Label>
//                   <Input
//                     id="contact_email"
//                     name="contact_email"
//                     type="email"
//                     placeholder="Email de contact"
//                     value={formData.contact_email || ''}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="contact_phone">Téléphone</Label>
//                   <Input
//                     id="contact_phone"
//                     name="contact_phone"
//                     placeholder="Numéro de téléphone"
//                     value={formData.contact_phone || ''}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="logo_url">URL du logo</Label>
//                   <Input
//                     id="logo_url"
//                     name="logo_url"
//                     placeholder="URL du logo"
//                     value={formData.logo_url || ''}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch
//                     id="active"
//                     checked={formData.active || false}
//                     onCheckedChange={handleSwitchChange}
//                   />
//                   <Label htmlFor="active">Actif</Label>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="submit" disabled={createMutation.isPending}>
//                   {createMutation.isPending ? "En cours..." : "Ajouter"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {error && (
//         <div className="text-red-500">Erreur: {error.message}</div>
//       )}

//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Modifier la coopérative</DialogTitle>
//             <DialogDescription>
//               Modifiez les informations de la coopérative.
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleSubmitEdit}>
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-name">Nom</Label>
//                 <Input
//                   id="edit-name"
//                   name="name"
//                   placeholder="Nom de la coopérative"
//                   value={formData.name || ''}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-description">Description</Label>
//                 <Textarea
//                   id="edit-description"
//                   name="description"
//                   placeholder="Description de la coopérative"
//                   value={formData.description || ''}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-contact_email">Email</Label>
//                 <Input
//                   id="edit-contact_email"
//                   name="contact_email"
//                   type="email"
//                   placeholder="Email de contact"
//                   value={formData.contact_email || ''}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-contact_phone">Téléphone</Label>
//                 <Input
//                   id="edit-contact_phone"
//                   name="contact_phone"
//                   placeholder="Numéro de téléphone"
//                   value={formData.contact_phone || ''}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="edit-logo_url">URL du logo</Label>
//                 <Input
//                   id="edit-logo_url"
//                   name="logo_url"
//                   placeholder="URL du logo"
//                   value={formData.logo_url || ''}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Switch
//                   id="edit-active"
//                   checked={formData.active || false}
//                   onCheckedChange={handleSwitchChange}
//                 />
//                 <Label htmlFor="edit-active">Actif</Label>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit" disabled={updateMutation.isPending}>
//                 {updateMutation.isPending ? "En cours..." : "Mettre à jour"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirmer la suppression</DialogTitle>
//             <DialogDescription>
//               Êtes-vous sûr de vouloir supprimer cette coopérative ? Cette action est irréversible.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
//               Annuler
//             </Button>
//             <Button 
//               variant="destructive" 
//               onClick={handleConfirmDelete}
//               disabled={deleteMutation.isPending}
//             >
//               {deleteMutation.isPending ? "En cours..." : "Supprimer"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <DataTable
//         columns={columns}
//         data={cooperatives || []}
//         isLoading={isLoading}
//         filterColumn="name"
//       />
//     </div>
//   );
// };

// export default Cooperatives;



import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCooperatives, createCooperative, updateCooperative, deleteCooperative } from '@/services/api';
import { Cooperative, CooperativeCreate } from '@/types/models';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { PlusCircle, Trash, Pencil, Check, Ban } from 'lucide-react';
import { toast } from 'sonner';

const Cooperatives: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCooperative, setSelectedCooperative] = useState<Cooperative | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    logo_url: '',
    active: true, 
    cooperative_id: ''
  });

  const { data: cooperatives, isLoading } = useQuery({
    queryKey: ['cooperatives'],
    queryFn: getCooperatives,
  });

  const createMutation = useMutation({
    mutationFn:  createCooperative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cooperatives'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Coopérative ajoutée avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'ajout: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCooperative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cooperatives'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Coopérative mise à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cooperative_id: string) => deleteCooperative(cooperative_id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cooperatives'] });
      setIsDeleteDialogOpen(false);
      toast.success("Coopérative supprimée avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      contact_email: '',
      contact_phone: '',
      logo_url: '',
      active: true,
      cooperative_id: ''
    });
    setSelectedCooperative(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  const handleEdit = (cooperative: Cooperative) => {
    setSelectedCooperative(cooperative);
    setFormData({
      name: cooperative.name,
      description: cooperative.description || '',
      contact_email: cooperative.contact_email || '',
      contact_phone: cooperative.contact_phone || '',
      logo_url: cooperative.logo_url || '',
      active: cooperative.active,
      cooperative_id: cooperative.cooperative_id
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (cooperative: Cooperative) => {
    setSelectedCooperative(cooperative);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedCooperative) {
      const filteredData = {
        ...formData,
      };
      updateMutation.mutate({
        cooperative_id: selectedCooperative.cooperative_id, // Remplacé _id par vehicule_id
        ...filteredData
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCooperative) {
      deleteMutation.mutate(selectedCooperative.cooperative_id);
    }
  };

  const columns: ColumnDef<Cooperative>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'contact_email',
      header: 'Email',
    },
    {
      accessorKey: 'contact_phone',
      header: 'Téléphone',
    },
    {
      accessorKey: 'active',
      header: 'Statut',
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.active ? (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              <Check className="h-3 w-3 mr-1" /> Actif
            </span>
          ) : (
            <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
              <Ban className="h-3 w-3 mr-1" /> Inactif
            </span>
          )}
        </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Coopératives</h1>
          <p className="text-muted-foreground">
            Gérez toutes vos coopératives partenaires ici.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une coopérative
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle coopérative</DialogTitle>
              <DialogDescription>
                Créez une nouvelle coopérative partenaire dans le système.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitAdd}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nom de la coopérative"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Description de la coopérative"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    placeholder="Email de contact"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact_phone">Téléphone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    placeholder="Numéro de téléphone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logo_url">URL du logo</Label>
                  <Input
                    id="logo_url"
                    name="logo_url"
                    placeholder="URL du logo"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="active">Actif</Label>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la coopérative</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la coopérative.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nom</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Nom de la coopérative"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  placeholder="Description de la coopérative"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contact_email">Email</Label>
                <Input
                  id="edit-contact_email"
                  name="contact_email"
                  type="email"
                  placeholder="Email de contact"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contact_phone">Téléphone</Label>
                <Input
                  id="edit-contact_phone"
                  name="contact_phone"
                  placeholder="Numéro de téléphone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-logo_url">URL du logo</Label>
                <Input
                  id="edit-logo_url"
                  name="logo_url"
                  placeholder="URL du logo"
                  value={formData.logo_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="edit-active">Actif</Label>
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
              Êtes-vous sûr de vouloir supprimer cette coopérative ? Cette action est irréversible.
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
        data={cooperatives || []}
        isLoading={isLoading}
        filterColumn="name"
      />
    </div>
  );
};

export default Cooperatives;

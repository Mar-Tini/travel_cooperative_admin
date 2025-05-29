
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const handleSaveSettings = () => {
    toast.success("Paramètres enregistrés avec succès");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérer les paramètres de l'application.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Général</CardTitle>
              <CardDescription>
                Paramètres généraux de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="app-name">Nom de l'application</Label>
                <Input id="app-name" defaultValue="TravelCoop Admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-description">Description</Label>
                <Textarea
                  id="app-description"
                  defaultValue="Administration des coopératives de transport routier"
                  className="min-h-32"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Mode maintenance</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configurer les notifications de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" defaultChecked />
                <Label htmlFor="email-notifications">Notifications par email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="push-notifications" defaultChecked />
                <Label htmlFor="push-notifications">
                  Notifications push
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sms-notifications" />
                <Label htmlFor="sms-notifications">Notifications SMS</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-server">Serveur SMTP</Label>
                <Input id="email-server" defaultValue="smtp.mail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-port">Port SMTP</Label>
                <Input id="email-port" defaultValue="587" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API</CardTitle>
              <CardDescription>
                Gérer les paramètres de l'API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">Clé API</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    defaultValue="1a2b3c4d5e6f7g8h9i0j"
                    readOnly
                  />
                  <Button variant="outline">Régénérer</Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="api-active" defaultChecked />
                <Label htmlFor="api-active">API active</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-rate-limit">Limite de requêtes par minute</Label>
                <Input id="api-rate-limit" type="number" defaultValue="100" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="api-log" defaultChecked />
                <Label htmlFor="api-log">Activer les logs d'API</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-6 border-t">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">État du système</h3>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center gap-3 bg-green-50 text-green-700 p-3 rounded-md">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="font-medium">Base de données connectée</p>
                <p className="text-sm">La connexion à la base de données est active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-50 text-green-700 p-3 rounded-md">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="font-medium">API prête</p>
                <p className="text-sm">L'API est en ligne et fonctionnelle</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-amber-50 text-amber-700 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Service notifications</p>
                <p className="text-sm">Le service est opérationnel mais des ralentissements sont possibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

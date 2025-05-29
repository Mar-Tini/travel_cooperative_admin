
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-travelcoop-500 mb-2">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page non trouvée</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Désolé, nous n'avons pas pu trouver la page que vous recherchez.
        </p>
        <Button asChild size="lg">
          <Link to="/">Retourner à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

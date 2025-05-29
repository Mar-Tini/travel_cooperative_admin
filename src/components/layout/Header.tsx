
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden md:block">
          <h2 className="text-xl font-semibold">Admin</h2>
        </div>
        
        <div className="w-full max-w-sm md:max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive"></span>
          </Button>
          <div className="h-8 w-8 rounded-full bg-travelcoop-500 text-white flex items-center justify-center font-medium">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import { 
//   BarChart3, 
//   Users, 
//   MapPin, 
//   Calendar, 
//   Car,
//   Settings,
//   LogOut,
//   Ticket,
//   Grid,
//   Menu // Icône hamburger
// } from 'lucide-react';

// const Sidebar = () => {
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false); // État pour gérer la réduction/élargissement

//   const menuItems = [
//     { 
//       name: 'Dashboard', 
//       path: '/', 
//       icon: <BarChart3 className="w-5 h-5" /> 
//     },
//     { 
//       name: 'Coopératives', 
//       path: '/cooperatives', 
//       icon: <Users className="w-5 h-5" /> 
//     },
//     { 
//       name: 'Routes', 
//       path: '/routes', 
//       icon: <MapPin className="w-5 h-5" /> 
//     },
//     { 
//       name: 'Véhicules', 
//       path: '/vehicules', 
//       icon: <Car className="w-5 h-5" /> 
//     },
//     { 
//       name: 'Trajets', 
//       path: '/trajets', 
//       icon: <Calendar className="w-5 h-5" /> 
//     },
//     { 
//       name: 'Réservations', 
//       path: '/trajets-cards', 
//       icon: <Ticket className="w-5 h-5" />
//     },
   
//     // {
//     //   name: 'Réservations',
//     //   path: '/reservations',
//     //   icon: <Ticket className="w-5 h-5" />
//     // },
//     { 
//       name: 'Paramètres', 
//       path: '/settings', 
//       icon: <Settings className="w-5 h-5" /> 
//     },
//   ];

//   return (
//     <div className={cn("bg-sidebar flex-shrink-0 text-sidebar-foreground border-r border-sidebar-border transition-all duration-300", 
//       isCollapsed ? "w-16" : "w-64 md:w-64")}>
//       <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
//         { !isCollapsed && (
//           <h1 className="text-xl font-bold flex items-center">
//             <span className="text-travelcoop-500 mr-2">TravelCoop</span>
//             <span className="text-sidebar-foreground">Admin</span>
//           </h1>
//         )}
//         <button 
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="p-2" // Toujours visible
//         >
//           <Menu className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="py-4">
//         <nav className="space-y-1 px-2">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={cn(
//                 "flex items-center px-3 py-2.5 text-sm rounded-md transition-colors",
//                 location.pathname === item.path
//                   ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
//                   : "text-sidebar-foreground hover:bg-sidebar-accent/50"
//               )}
//             >
//               {item.icon}
//               {!isCollapsed && <span className="ml-3">{item.name}</span>}
//             </Link>
//           ))}
//         </nav>
//       </div>
      
//       <div className={cn("p-4 border-t border-sidebar-border", isCollapsed ? "text-center" : "")}>
//         <button 
//           onClick={() => console.log("Déconnexion")}
//           className="flex items-center w-full px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors"
//         >
//           <LogOut className="w-5 h-5" />
//           {!isCollapsed && <span className="ml-3">Déconnexion</span>}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Calendar, 
  Car,
  Settings,
  LogOut,
  Ticket,
  Grid,
  Menu // Icône hamburger
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false); // État pour gérer la réduction/élargissement

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <BarChart3 className="w-5 h-5" /> 
    },
    { 
      name: 'Coopératives', 
      path: '/cooperatives', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Routes', 
      path: '/routes', 
      icon: <MapPin className="w-5 h-5" /> 
    },
    { 
      name: 'Véhicules', 
      path: '/vehicules', 
      icon: <Car className="w-5 h-5" /> 
    },
    { 
      name: 'Trajets', 
      path: '/trajets', 
      icon: <Calendar className="w-5 h-5" /> 
    },
    { 
      name: 'Réservations', 
      path: '/trajets-cards', 
      icon: <Ticket className="w-5 h-5" />
    },
    { 
      name: 'Paramètres', 
      path: '/settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];

  return (
    <div className={cn("bg-sidebar flex-shrink-0 text-sidebar-foreground border-r border-sidebar-border transition-all duration-300", 
      isCollapsed ? "w-16" : "w-64 md:w-64")}>
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold flex items-center">
            <span className="text-travelcoop-500 mr-2">TravelCoop</span>
            <span className="text-sidebar-foreground">Admin</span>
          </h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2" // Toujours visible
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      
      <div className="py-4 flex-1  overflow-y-auto">
        <nav className="space-y-1 px-2 flex flex-col gap-4 ">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className={cn("p-4 border-t w-100 border-white border-sidebar-border flex flex-col gap-4", isCollapsed ? "text-center" : "")}
      style={{
        position:"absolute", 
        bottom:0, 
      }}>
   

        <button 
          onClick={() => console.log("Déconnexion")}
          className={cn(
            "flex items-center w-full  px-3 py-2.5 text-sm rounded-md transition-colors",
            "text-sidebar-foreground hover:bg-sidebar-accent/50",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
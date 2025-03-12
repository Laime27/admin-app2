import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  LayoutPanelLeft, 
  Layers, 
  Users,
  Calendar,
  FileText,
  Plane,
  Settings as SettingsIcon,
  X
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link to={href} className="w-full">
      <div
        className={cn(
          "flex items-center py-2 px-4 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors duration-200 gap-x-3",
          active && "bg-sidebar-accent text-white"
        )}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-[250px] lg:w-[174px] bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-4 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-1 rounded">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-white">Dashboard</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col py-4 space-y-1">
          <div className="px-4 py-2">
            <p className="text-xs font-medium text-gray-400">Main Menu</p>
          </div>
          
          <SidebarItem
            icon={<LayoutPanelLeft className="sidebar-icon" />}
            label="Panel Control"
            href="/panel-control"
            active={pathname === "/panel-control"}
          />
          
          <SidebarItem
            icon={<Layers className="sidebar-icon" />}
            label="Categorías"
            href="/categorias"
            active={pathname === "/categorias"}
          />
          
          <SidebarItem
            icon={<Users className="sidebar-icon" />}
            label="Usuarios"
            href="/usuarios"
            active={pathname === "/usuarios"}
          />
          
          <SidebarItem
            icon={<Calendar className="sidebar-icon" />}
            label="Citas"
            href="/citas"
            active={pathname === "/citas"}
          />
          
          <SidebarItem
            icon={<FileText className="sidebar-icon" />}
            label="Documentos"
            href="/documentos"
            active={pathname === "/documentos"}
          />
          
          <SidebarItem
            icon={<Plane className="sidebar-icon" />}
            label="Migraciones"
            href="/migraciones"
            active={pathname === "/migraciones"}
          />
        </div>
        
        <div className="mt-auto flex flex-col py-4 border-t border-sidebar-border">
          <div className="px-4 py-2">
            <p className="text-xs font-medium text-gray-400">Settings</p>
          </div>
          
          <SidebarItem
            icon={<SettingsIcon className="sidebar-icon" />}
            label="Settings"
            href="/settings"
            active={pathname === "/settings"}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

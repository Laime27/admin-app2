import { useState, useRef } from "react";
import { Search, Bell, SplitSquareVertical, Moon, Menu } from "lucide-react";
import ProfileMenu from "@/components/ProfileMenu";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <div className="h-16 fixed top-0 right-0 left-0 lg:left-[174px] bg-background border-b border-sidebar-border flex items-center justify-between px-4 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary/50 transition-colors"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <div className="hidden sm:flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 rounded-md bg-secondary/30 border border-secondary text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary/50 cursor-pointer transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center hover:bg-secondary/50 cursor-pointer transition-colors">
          <SplitSquareVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center hover:bg-secondary/50 cursor-pointer transition-colors">
          <Moon className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div 
          ref={avatarRef}
          className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center cursor-pointer transition-colors hover:bg-secondary/70"
          onClick={toggleProfileMenu}
        >
          <span className="text-sm font-medium text-white">JD</span>
        </div>

        <ProfileMenu 
          isOpen={profileMenuOpen} 
          onClose={() => setProfileMenuOpen(false)} 
          avatarRef={avatarRef}
        />
      </div>
    </div>
  );
};

export default Navbar;

import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  avatarRef: React.RefObject<HTMLDivElement>;
}

const ProfileMenu = ({ isOpen, onClose, avatarRef }: ProfileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        avatarRef.current && 
        !avatarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, avatarRef]);

  const handleProfileClick = () => {
    navigate('/profile');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute top-14 right-4 w-48 bg-card rounded-md shadow-lg border border-secondary/20 py-1 z-50"
    >
      <div className="px-4 py-2 border-b border-secondary/20">
        <p className="text-sm font-medium text-white">John Doe</p>
        <p className="text-xs text-gray-400">john.doe@example.com</p>
      </div>
      
      <div className="py-1">
        <button 
          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-secondary/20 flex items-center gap-2"
          onClick={handleProfileClick}
        >
          <User size={16} />
          <span>Profile</span>
        </button>
        
        <button 
          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-secondary/20 flex items-center gap-2"
          onClick={() => console.log('Configuration clicked')}
        >
          <Settings size={16} />
          <span>Configuration</span>
        </button>
      </div>
      
      <div className="border-t border-secondary/20 py-1">
        <button 
          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-secondary/20 flex items-center gap-2"
          onClick={() => console.log('Sign Up clicked')}
        >
          <LogIn size={16} />
          <span>Sign Up</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu; 
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="shadow-md bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-primary text-2xl font-bold">
              DriveEase
            </Link>
          </div>
          
          {/* Basket section removed */}
        </div>
      </div>
    </header>
  );
};

// We're not using NavLink anymore but keeping it in case needed later
interface NavLinkProps {
  href: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, isActive, onClick, children }) => {
  return (
    <Link
      href={href}
      className={`py-2 px-1 border-b-2 transition-colors duration-200 flex items-center ${
        isActive 
          ? 'border-primary text-primary font-medium' 
          : 'border-transparent text-gray-600 hover:text-primary hover:border-primary'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Header; 
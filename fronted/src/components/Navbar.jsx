import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Upload' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/history', label: 'History' },
    { path: '/comparison', label: 'Comparison' },
    { path: '/features', label: 'Features' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/plans', label: 'Plans' },
    { path: '/learning', label: 'Learning' },
  ];

  const LinkItem = ({ to, label, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "px-2 lg:px-3 py-2 text-sm lg:text-base font-semibold transition-colors duration-200",
          isActive 
            ? "text-brand-primary border-b-2 border-brand-primary" 
            : "text-brand-textSecondary hover:text-brand-textPrimary"
        )
      }
    >
      {label}
    </NavLink>
  );

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 w-40">
            <span className="text-white font-extrabold text-2xl tracking-tight">ReviewMind</span>
          </div>
          
          <div className="hidden lg:flex flex-1 justify-center space-x-1 lg:space-x-2">
            {navLinks.map(link => (
               <LinkItem key={link.path} to={link.path} label={link.label} />
            ))}
          </div>

          <div className="hidden md:flex items-center justify-end w-40">
             <button 
                onClick={() => navigate('/upload')}
                className="bg-brand-primary hover:bg-brand-primary/80 text-white px-5 py-2 text-sm rounded-full font-bold transition-all shadow-lg hover:shadow-brand-primary/30"
             >
                Get Started
             </button>
          </div>

          <div className="md:hidden flex items-center justify-end w-40">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-textSecondary hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 w-full bg-brand-dark border-b border-brand-border py-4 flex flex-col items-center space-y-4"
          >
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-lg font-semibold w-full text-center py-2",
                    isActive ? "text-brand-primary" : "text-brand-textSecondary"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button 
               onClick={() => { setIsOpen(false); navigate('/upload'); }}
               className="bg-brand-primary text-white w-2/3 py-3 rounded-full font-semibold"
            >
               Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Hjem', href: '/' },
    { name: 'Hvordan det fungerer', href: '#how-it-works' },
    { name: 'Fordeler', href: '#features' },
    { name: 'Tilbakemeldinger', href: '#testimonials' },
    { name: 'Kontakt', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'glassmorphism py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          EdPath
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.name === 'Hjem' ? (
                  <Link 
                    to={item.href} 
                    className="link-hover text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a 
                    href={item.href} 
                    className="link-hover text-sm font-medium"
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        <Link to="/registrer" className="hidden rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 md:block">
          Kom i gang
        </Link>
        
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background py-4 md:hidden">
          <div className="container mx-auto px-4">
            <nav>
              <ul className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    {item.name === 'Hjem' ? (
                      <Link 
                        to={item.href} 
                        className="block py-2 text-sm font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <a 
                        href={item.href} 
                        className="block py-2 text-sm font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
                <li>
                  <Link to="/registrer" className="mt-2 w-full rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
                    Kom i gang
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;

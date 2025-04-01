
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User, LogOut } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOut } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const navItems = [
    { name: 'Hjem', href: '/' },
    { name: 'Statistikk', href: '/statistikk' },
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
    
    const checkSession = async () => {
      try {
        const user = await getCurrentUser();
        
        if (user) {
          const userMeta = user.user_metadata || {};
          
          const userData = {
            id: user.id,
            email: user.email,
            firstName: userMeta.firstName || userMeta.name?.split(' ')[0] || user.email?.split('@')[0] || '',
            lastName: userMeta.lastName || 
              (userMeta.name?.split(' ').length > 1 ? userMeta.name?.split(' ').slice(1).join(' ') : ''),
            userType: userMeta.userType || '',
            avatar: userMeta.avatar_url || userMeta.picture || null,
            isVerified: true
          };
          
          setCurrentUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('userData', JSON.stringify({
            email: user.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userType: userMeta.userType || '',
            isVerified: true
          }));
        }
      } catch (error) {
        console.error("Error checking session:", error);
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      }
    };
    
    checkSession();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      
      if (error) {
        toast.error(`Kunne ikke logge ut: ${error.message}`);
        return;
      }
      
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userData');
      localStorage.removeItem('userFullData');
      
      setCurrentUser(null);
      toast.success("Du er nå logget ut");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Kunne ikke logge ut. Vennligst prøv igjen.");
    }
  };

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
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/7e0fff54-a7d0-402f-9762-aaabb01acfe1.png" 
            alt="EdPath Logo" 
            className="h-16 w-auto" 
          />
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.href.startsWith('/') ? (
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
        
        {currentUser ? (
          <div className="hidden items-center space-x-4 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{currentUser.firstName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/results')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/results')}>
                  Min profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logg ut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden space-x-4 md:flex">
            <Link to="/login" className="flex items-center px-5 py-2 text-sm font-medium transition-all duration-200 hover:text-primary">
              Logg inn
            </Link>
            <Link to="/registrer" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90">
              Kom i gang
            </Link>
          </div>
        )}
        
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
      
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background py-4 md:hidden">
          <div className="container mx-auto px-4">
            <nav>
              <ul className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    {item.href.startsWith('/') ? (
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
                
                {currentUser ? (
                  <>
                    <li>
                      <Link 
                        to="/results" 
                        className="block py-2 text-sm font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/results" 
                        className="block py-2 text-sm font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Min profil
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center py-2 text-sm font-medium text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logg ut
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link 
                        to="/login"
                        className="block py-2 text-sm font-medium" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Logg inn
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/registrer" 
                        className="mt-2 w-full rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Kom i gang
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;

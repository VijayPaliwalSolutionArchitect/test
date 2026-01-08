import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import { cn } from '../../utils/helpers';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Target, 
  Boxes, 
  AlertTriangle, 
  Map,
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Emergent Points', path: '/points', icon: Lightbulb },
    { name: 'Tech Radar', path: '/radar', icon: Target },
    { name: 'Architectures', path: '/architectures', icon: Boxes },
    { name: 'Risk Map', path: '/risks', icon: AlertTriangle },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-color)] shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold font-display text-gradient hover:scale-105 transition-transform duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:block">Tech Intel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(link.path)
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors duration-300"
              aria-label="Toggle mobile menu"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[var(--text-primary)]" />
              ) : (
                <Menu className="w-6 h-6 text-[var(--text-primary)]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                    isActive(link.path)
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

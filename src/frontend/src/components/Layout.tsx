import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Sparkles, Plus } from 'lucide-react';
import LoginButton from './LoginButton';
import ProfileSetup from './ProfileSetup';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      <ProfileSetup />
      
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Sparkles className="h-6 w-6 text-neon-green transition-transform group-hover:rotate-12" />
            <span className="text-2xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-pink bg-clip-text text-transparent">
              Neon Genesis
            </span>
          </Link>

          <nav className="flex items-center space-x-4">
            {isAuthenticated && (
              <button
                onClick={() => navigate({ to: '/create-post' })}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-green to-neon-blue text-background font-medium hover:shadow-lg hover:shadow-neon-green/50 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                <span>Create</span>
              </button>
            )}
            <LoginButton />
          </nav>
        </div>
      </header>

      <main className="container py-8">
        {children}
      </main>

      <footer className="border-t border-border/40 py-6 mt-16">
        <div className="container flex flex-col items-center justify-center space-y-2 text-sm text-muted-foreground">
          <p>
            Built with <span className="text-neon-pink">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-blue hover:text-neon-green transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs">© {new Date().getFullYear()} Neon Genesis. Empowering sustainable innovation.</p>
        </div>
      </footer>
    </div>
  );
}

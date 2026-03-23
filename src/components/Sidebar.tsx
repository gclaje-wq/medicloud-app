import { Activity, Calendar, Users, FileText, LogOut, Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  onLogout?: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function Sidebar({ onLogout, theme, onThemeToggle }: SidebarProps) {
  const { i18n } = useTranslation();

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sidebar-header">
        <Activity className="logo-icon" size={28} />
        <span>MediCloud</span>
      </div>
      
      <nav className="sidebar-nav" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="nav-item active">
          <Activity size={20} />
          <span>Dashboard</span>
        </div>
        <div className="nav-item">
          <Users size={20} />
          <span>Pacientes</span>
        </div>
        <div className="nav-item">
          <Calendar size={20} />
          <span>Agenda</span>
        </div>
        <div className="nav-item">
          <FileText size={20} />
          <span>Estudios</span>
        </div>
        
        <div style={{ marginTop: 'auto', paddingBottom: '1rem' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', marginLeft: '1rem', letterSpacing: '0.05em' }}>Ajustes</p>
          
          <div className="nav-item" onClick={onThemeToggle}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span>{theme === 'light' ? 'Modo Noche' : 'Modo Día'}</span>
          </div>
          
          <div className="nav-item" onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}>
            <Globe size={20} />
            <span>{i18n.language.toUpperCase()} (Switch)</span>
          </div>

          <div className="nav-item" style={{ color: '#f87171', marginTop: '0.5rem' }} onClick={onLogout}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </nav>
    </aside>
  );
}

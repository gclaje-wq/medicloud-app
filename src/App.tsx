import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardHome } from './components/DashboardHome';
import { PatientApp } from './components/PatientApp';
import { AuthPage } from './components/AuthPage';
import './patient.css';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<'DOCTOR' | 'PATIENT' | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [userName, setUserName] = useState<string>('Gonzalo');

  // Notificación de WebSockets para el Doctor
  useEffect(() => {
    if (isAuthenticated && role === 'DOCTOR') {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
    }
  }, [isAuthenticated, role]);

  const handleLogin = (selectedRole: 'DOCTOR' | 'PATIENT', name: string) => {
    setRole(selectedRole);
    setUserName(name || 'Gonzalo');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
  };

  // Sincronizar el tema con el DOM para variables CSS
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themeToggleBtn = (
    <div style={{ position: 'fixed', top: '1.5rem', right: isAuthenticated ? '11rem' : '2rem', display: 'flex', gap: '0.5rem', zIndex: 9999 }}>
      {/* Botón de Idioma */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '0.6rem',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', transition: 'all 0.2s ease'
      }}
      onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
      title="Cambiar Idioma / Change Language"
      >
        <Globe size={20} color="var(--text-primary)" />
        <span style={{ fontSize: '0.65rem', position: 'absolute', bottom: '-15px', fontWeight: 600 }}>{i18n.language.toUpperCase()}</span>
      </div>

      {/* Botón de Tema */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '0.6rem',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', transition: 'all 0.2s ease'
      }}
      onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      title="Alternar Modo Oscuro"
      >
        {theme === 'light' ? <Moon size={20} color="var(--text-primary)" /> : <Sun size={20} color="var(--text-primary)" />}
      </div>
    </div>
  );

  const themeToggleFloating = (!isAuthenticated) ? themeToggleBtn : null;

  if (!isAuthenticated || !role) {
    return (
      <>
        {themeToggleFloating}
        <AuthPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      {themeToggleFloating}
      {role === 'PATIENT' ? (
        <PatientApp 
          userName={userName} 
          onLogout={handleLogout} 
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
      ) : (
        <div className="app-container">
          <Sidebar 
            onLogout={handleLogout} 
            theme={theme} 
            onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
          />
          <main className="main-content">
            <Topbar />
            
            <div className="content-area">
              <DashboardHome patientName={userName} />
            </div>
          </main>

          {/* Floating Notification */}
          {showNotification && (
            <div className="notification-popover">
              <div className="notification-pulse"></div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.2rem' }}>Nueva Resonancia</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  El paciente <strong style={{color: 'var(--text-primary)'}}>{userName}</strong> subió un estudio.
                </p>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.4rem 0.8rem', marginLeft: '1rem' }}
                onClick={() => setShowNotification(false)}
              >
                Ver
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;

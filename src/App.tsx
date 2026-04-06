import { useState, useEffect } from 'react';
import { PatientApp } from './components/PatientApp';
import { AuthPage } from './components/AuthPage';
import './patient.css';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>('Gonzalo');

  const handleLogin = (name: string) => {
    setUserName(name || 'Gonzalo');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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

  if (!isAuthenticated) {
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
      <PatientApp 
        userName={userName} 
        onLogout={handleLogout} 
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    </>
  );
}

export default App;


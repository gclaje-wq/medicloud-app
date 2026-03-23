import { useState } from 'react';
import { Mail, Lock, UserRound, ShieldPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuthPageProps {
  onLogin: (role: 'DOCTOR' | 'PATIENT', userName: string) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validación de campos vacíos
    if (!email || !password) {
      setErrorMsg(t('auth.errorEmpty'));
      return;
    }

    setErrorMsg('');
    let name = 'Gonzalo'; // Fallback por defecto
    if (email) {
      const parts = email.split('@')[0];
      const cleanName = parts.replace(/[.\d_+-]/g, ' ').trim().split(' ')[0];
      name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
    onLogin(selectedRole, name || 'Gonzalo');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <ShieldPlus size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h1>MediCloud</h1>
          <p>{t('auth.subtitle')}</p>
        </div>

        <div className="oauth-buttons">
          <button type="button" className="btn-oauth" onClick={() => handleAuth()}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="oauth-icon">
               <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
               <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
               <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
               <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
             </svg>
             {isRegister ? t('auth.registerWith') : t('auth.loginWith')}
          </button>
        </div>

        <div className="divider">
          <span>{t('auth.orUseEmail')}</span>
        </div>

        <form className="auth-form" onSubmit={handleAuth} noValidate>
          {errorMsg && (
            <div className="error-banner" style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              marginBottom: '1rem', 
              fontSize: '0.85rem',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {errorMsg}
            </div>
          )}
          {isRegister && (
            <div className="form-group">
               <UserRound className="input-icon" size={20} />
               <input type="text" placeholder={t('auth.name')} required />
            </div>
          )}
          
          <div className="form-group">
             <Mail className="input-icon" size={20} />
             <input type="email" placeholder={t('auth.email')} required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
             <Lock className="input-icon" size={20} />
             <input 
               type="password" 
               placeholder={t('auth.password')} 
               required 
               value={password} 
               onChange={(e) => {
                 setPassword(e.target.value);
                 if (errorMsg) setErrorMsg('');
               }} 
             />
          </div>

          <div className="role-selector">
             <p>{t('auth.accountType')}</p>
             <div className="role-options">
               <button 
                 type="button"
                 className={`role-btn ${selectedRole === 'PATIENT' ? 'active' : ''}`}
                 onClick={() => setSelectedRole('PATIENT')}
               >
                 {t('auth.patient')}
               </button>
               <button 
                 type="button"
                 className={`role-btn ${selectedRole === 'DOCTOR' ? 'active' : ''}`}
                 onClick={() => setSelectedRole('DOCTOR')}
               >
                 {t('auth.doctor')}
               </button>
             </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
             {isRegister ? t('auth.btnRegister') : t('auth.btnLogin')}
          </button>
        </form>

        <p className="auth-footer">
          {isRegister ? t('auth.hasAccount') : t('auth.noAccount')} 
           <button type="button" className="text-link" onClick={() => setIsRegister(!isRegister)}>
             {isRegister ? t('auth.loginHere') : t('auth.registerHere')}
           </button>
        </p>
      </div>
    </div>
  );
}

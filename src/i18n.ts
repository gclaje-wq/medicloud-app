import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      auth: {
        subtitle: "Tu salud conectada de manera segura.",
        loginWith: "Ingresar con Google",
        registerWith: "Registrarse con Google",
        orUseEmail: "O usá tu correo electrónico",
        name: "Nombre Completo",
        email: "Correo Electrónico",
        password: "Contraseña",
        accountType: "Tipo de cuenta:",
        patient: "Paciente",
        doctor: "Profesional",
        btnRegister: "Crear Cuenta Segura",
        btnLogin: "Iniciar Sesión",
        noAccount: "¿No tenés una cuenta?",
        hasAccount: "¿Ya tenés cuenta?",
        loginHere: "Iniciá Sesión",
        registerHere: "Registrate aquí"
      },
      nav: {
        home: "Inicio",
        studies: "Estudios",
        appointments: "Citas",
        privacy: "Privacidad"
      },
      patient: {
        hello: "Hola, {{name}}!",
        healthUpToDate: "Tu salud al día",
        recentActivity: "Actividad Reciente",
        seeAll: "Ver todo",
        uploadStudy: "Subir Estudio",
        scheduleAppt: "Agendar Cita",
        myStudies: "Mis Estudios Clínicos",
        liveFiles: "Archivos Vivos",
        trends: "Tendencias (Labs)",
        uploadPDF: "Subir PDF",
        scanPaper: "Escanear Papel",
        mri: "Resonancia Magnética (Rodilla)",
        mriDate: "Ayer • En revisión",
        mriDoc: "Para: Dra. Ana Ríos",
        agenda: "Agenda Médica",
        schedule: "Agendar",
        upcoming: "Próximos Turnos",
        pastHistory: "Historial Pasado",
        privacyMgmt: "Gestión de Permisos",
        privacyDesc: "Tu historia clínica es tuya. Elegí exactamente qué profesionales y centros médicos pueden acceder a tu información en tiempo real.",
        activeAccess: "Acceso Activo",
        revoked: "Revocado",
        view: "Ver"
      }
    }
  },
  en: {
    translation: {
      auth: {
        subtitle: "Your health, securely connected.",
        loginWith: "Sign in with Google",
        registerWith: "Sign up with Google",
        orUseEmail: "Or use your email",
        name: "Full Name",
        email: "Email Address",
        password: "Password",
        accountType: "Account Type:",
        patient: "Patient",
        doctor: "Doctor",
        btnRegister: "Create Secure Account",
        btnLogin: "Sign In",
        noAccount: "Don't have an account?",
        hasAccount: "Already have an account?",
        loginHere: "Sign in here",
        registerHere: "Sign up here"
      },
      nav: {
        home: "Home",
        studies: "Studies",
        appointments: "Appts",
        privacy: "Privacy"
      },
      patient: {
        hello: "Hello, {{name}}!",
        healthUpToDate: "Your health, continuously tracked",
        recentActivity: "Recent Activity",
        seeAll: "See all",
        uploadStudy: "Upload Study",
        scheduleAppt: "Book Appt",
        myStudies: "My Clinical Studies",
        liveFiles: "Live Files",
        trends: "Trends (Labs)",
        uploadPDF: "Upload PDF",
        scanPaper: "Scan Paper",
        mri: "Knee MRI",
        mriDate: "Yesterday • Under Review",
        mriDoc: "For: Dr. Ana Rios",
        agenda: "Medical Agenda",
        schedule: "Schedule",
        upcoming: "Upcoming Appts",
        pastHistory: "Past History",
        privacyMgmt: "Permissions Management",
        privacyDesc: "Your medical history is yours. Choose exactly which physicians and medical centers can access your information in real-time.",
        activeAccess: "Active Access",
        revoked: "Revoked",
        view: "View"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es', 
  fallbackLng: 'es',
  interpolation: { escapeValue: false }
});

export default i18n;

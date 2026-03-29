import { Upload, FileText, Calendar, Activity, ShieldCheck, UserX, UserCheck, CheckCircle, Eye, X, Camera, Edit2, AlertCircle, LogOut, QrCode, Sun, Moon, Globe, Building2, MapPin, Stethoscope, Star, Bell, Map } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type UploadedFile = {
  name: string;
  size: string;
  url: string;
  isImage: boolean;
  uploader?: string;
  uploadDate?: string;
  center?: string;
  type?: 'INST' | 'USER';
};

export function PatientApp({ 
  userName = 'Gonzalo', 
  onLogout,
  theme,
  onThemeToggle
}: { 
  userName?: string, 
  onLogout?: () => void,
  theme: 'light' | 'dark',
  onThemeToggle: () => void
}) {
  const { t, i18n } = useTranslation();
  const [docRiosAccess, setDocRiosAccess] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [activeTab, setActiveTab] = useState<'HOME' | 'ESTUDIOS' | 'CITAS' | 'PRIVACIDAD'>('HOME');
  
  // Novedades MVP UX:
  const [estudiosSubTab, setEstudiosSubTab] = useState<'HISTORIAL' | 'ADJUNTAR'>('HISTORIAL');
  const [studyName, setStudyName] = useState('');
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [isSymptomOpen, setIsSymptomOpen] = useState(false);
  const [isPreConsultOpen, setIsPreConsultOpen] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [schedulingType, setSchedulingType] = useState<'DOCTOR' | 'LAB'>('DOCTOR');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedDay, setSelectedDay] = useState('03');
  const [selectedHour, setSelectedHour] = useState('09:30');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapLocation, setMapLocation] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Estudio Recibido', desc: 'Hospital Alemán subió tu Ecografía Abdominal.', time: 'Hace 5m', unread: true },
    { id: 2, title: 'Recordatorio Turno', desc: 'Mañana 09:30hs con Dra. Ana Ríos.', time: 'Hace 2h', unread: false }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Esc key logic to close the lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewFile(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local blob URL so we can actually "view" the uploaded file
    const fileUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');

    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadedFiles(prev => [{
            name: studyName || file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
             url: fileUrl,
            isImage,
            uploadDate: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
            uploader: 'Usted'
          }, ...prev]);
          setStudyName('');
          setEstudiosSubTab('HISTORIAL');
        }, 900);
      }
      setUploadProgress(progress);
    }, 400);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOcrScan = () => {
    setIsOcrScanning(true);
    setTimeout(() => {
      setIsOcrScanning(false);
      setActiveTab('ESTUDIOS');
      setEstudiosSubTab('HISTORIAL');
      // Append the scanned value magically
      setUploadedFiles(prev => [{
        name: studyName || 'Escaneo Clínico',
        size: '0.8 MB',
        url: '',
        isImage: true,
        uploadDate: 'Hoy',
        uploader: 'Usted'
      }, ...prev]);
      setStudyName('');
    }, 2500);
  };

  const institutionalFiles: UploadedFile[] = [
    { name: 'Ecografía Abdominal', size: '2.4 MB', url: '', isImage: false, uploadDate: '25 Mar', center: 'Hospital Alemán', type: 'INST' },
    { name: 'Radiografía de Tórax', size: '1.1 MB', url: '', isImage: false, uploadDate: '10 Feb', center: 'Sanatorio Otamendi', type: 'INST' }
  ];

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={10} 
            fill={star <= Math.floor(rating) ? '#fbbf24' : 'transparent'} 
            color={star <= Math.floor(rating) ? '#fbbf24' : '#d1d5db'} 
          />
        ))}
      </div>
    );
  };

  const confirmAppointment = () => {
    setIsScheduling(false);
    const title = schedulingType === 'DOCTOR' ? (selectedPlace || 'Consulta Médica') : (selectedPlace || 'Estudio Clínico');
    const subtitle = schedulingType === 'DOCTOR' ? `Profesional • ${selectedDay} Abr, ${selectedHour}` : `Ctro. Diagnóstico • ${selectedDay} Abr, ${selectedHour}`;
    
    setUploadedFiles(prev => [{
      name: title,
      size: subtitle,
      url: '',
      isImage: false,
      isAppointment: true
    } as any, ...prev]);
  };

  return (
    <div className="mobile-app-container">
      <div className="mobile-app-mockup">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*,.pdf" 
          onChange={handleFileChange} 
        />

        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="patient-profile">
            <div className="patient-avatar-lg">{userName.substring(0, 2).toUpperCase()}</div>
            <div>
              <h2>{t('patient.hello', { name: userName })}</h2>
              <p>{t('patient.healthUpToDate')}</p>
            </div>
          </div>
          <button className="icon-btn" onClick={() => setIsNotifOpen(true)} style={{ marginRight: '0.2rem', position: 'relative' }}>
            <Bell color="var(--text-secondary)" size={22} />
            {notifications.some(n => n.unread) && (
              <span className="notification-dot"></span>
            )}
          </button>
          <button className="icon-btn" onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')} style={{ marginRight: '0.2rem' }}>
            <Globe color="var(--text-secondary)" size={22} />
          </button>
          <button className="icon-btn" onClick={onThemeToggle} style={{ marginRight: '0.5rem' }}>
            {theme === 'light' ? <Moon color="var(--text-secondary)" size={22} /> : <Sun color="var(--text-secondary)" size={22} />}
          </button>
          <button className="icon-btn" onClick={() => setIsQrOpen(true)} style={{ marginRight: '0.5rem' }}>
            <QrCode color="var(--accent-primary)" size={24} />
          </button>
          <button className="icon-btn" onClick={onLogout}>
            <LogOut color="var(--danger)" size={24} />
          </button>
        </div>

        <div className="mobile-scroll-area">
          
          {/* ----- TAB: INICIO ----- */}
          {activeTab === 'HOME' && (
            <>
              {/* Action Buttons */}
              <div className="mobile-actions" style={{ padding: '0 0 1.5rem 0', backgroundColor: 'transparent' }}>
                <button className="action-btn btn-primary" style={{ flex: 1, padding: '1rem' }} onClick={() => setIsScheduling(true)}>
                  <Calendar size={20} />
                  <span>{t('patient.scheduleAppt')}</span>
                </button>
              </div>

              <div className="mobile-section">
                <div className="section-header">
                  <h3>{t('patient.recentActivity')}</h3>
                  <button className="btn-view-study" style={{ border: 'none', background: 'transparent' }} onClick={() => setActiveTab('ESTUDIOS')}>{t('patient.seeAll')}</button>
                </div>
                
                <div className="timeline">
                  {uploadedFiles.slice(0, 3).map((file: any, idx) => {
                    const isAppt = file.isAppointment;
                    return (
                      <div key={idx} className="timeline-item timeline-uploaded">
                        <div className={`timeline-icon ${isAppt ? 'bg-green' : 'bg-blue'}`}>
                          {isAppt ? <Calendar size={14} /> : <CheckCircle size={14} />}
                        </div>
                        <div className="timeline-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4>{file.name}</h4>
                              <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>{file.size}</span>
                            </div>
                            {!isAppt && (
                              <button 
                                className="btn-view-study" 
                                onClick={() => setPreviewFile(file)}
                              >
                                <Eye size={14} /> Ver
                              </button>
                            )}
                          </div>
                          <p style={{ marginTop: '0.25rem' }}>{isAppt ? 'Turno Confirmado' : `Subido por ${file.uploader || 'Centro'} • ${file.uploadDate || 'Hoy'}`}</p>
                          <span className="timeline-doctor">{isAppt ? 'Agendado hoy' : (file.type === 'INST' ? 'Validado por Institución' : 'Compartido con Médicos Activos')}</span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="timeline-item">
                    <div className="timeline-icon bg-blue"><Upload size={14} /></div>
                    <div className="timeline-content">
                      <h4>{t('patient.mri')}</h4>
                      <p>{t('patient.mriDate')}</p>
                      <span className="timeline-doctor">{t('patient.mriDoc')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ----- TAB: ESTUDIOS ----- */}
          {activeTab === 'ESTUDIOS' && (
            <div className="mobile-section">
              <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                <h3>{t('patient.myStudies')}</h3>
              </div>

              <div className="segment-control">
                <button 
                  className={`segment-btn ${estudiosSubTab === 'HISTORIAL' ? 'active' : ''}`} 
                  onClick={() => setEstudiosSubTab('HISTORIAL')}
                >
                  <FileText size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  HISTORIAL
                </button>
                <button 
                  className={`segment-btn ${estudiosSubTab === 'ADJUNTAR' ? 'active' : ''}`} 
                  onClick={() => setEstudiosSubTab('ADJUNTAR')}
                >
                  <Upload size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  ADJUNTAR
                </button>
              </div>

              {estudiosSubTab === 'HISTORIAL' && (
                <>
                  <div className="timeline">
                    {/* Synchronized from Centers */}
                    <div style={{ padding: '0.8rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '1rem', border: '1px dotted var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={14} className="pulse" color="var(--accent-primary)" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Sincronizando con Centros Externos...</span>
                    </div>

                    {[...uploadedFiles.filter(f => !(f as any).isAppointment), ...institutionalFiles].map((file: any, idx) => (
                      <div key={idx} className="timeline-item timeline-uploaded">
                        <div className={`timeline-icon ${file.type === 'INST' ? 'bg-green' : 'bg-blue'}`}>
                          {file.type === 'INST' ? <Building2 size={14} /> : <CheckCircle size={14} />}
                        </div>
                        <div className="timeline-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <h4>{file.name}</h4>
                                {file.type === 'INST' && (
                                  <span style={{ fontSize: '0.6rem', backgroundColor: 'var(--success)', color: 'white', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>OFICIAL</span>
                                )}
                              </div>
                              <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>{file.size} {file.center ? `• ${file.center}` : ''}</span>
                            </div>
                            <button className="btn-view-study" onClick={() => file.type !== 'INST' ? setPreviewFile(file) : alert("Abriendo portal seguro del Centro...")}>
                              <Eye size={14} /> {t('patient.view')}
                            </button>
                          </div>
                          <p style={{ marginTop: '0.25rem' }}>{file.type === 'INST' ? `Validado por ${file.center}` : `Subido por ${file.uploader || 'Usted'} • ${file.uploadDate || 'Hoy'}`}</p>
                          <span className="timeline-doctor">
                            {file.type === 'INST' ? 'Firmado digitalmente • Historia Clínica Única' : 'Nube segura • Compartido con médicos'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {estudiosSubTab === 'ADJUNTAR' && (
                <div style={{ padding: '1rem 0' }}>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Nombre del Estudio (Obligatorio)</label>
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="Ej: Análisis de Sangre, Ecografía..." 
                      value={studyName}
                      onChange={(e) => setStudyName(e.target.value)}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button 
                      className={`btn ${studyName ? 'btn-primary' : 'btn-outline'}`} 
                      style={{ padding: '1rem', opacity: studyName ? 1 : 0.5 }}
                      disabled={!studyName}
                      onClick={handleUploadClick}
                    >
                      <Upload size={18} /> Subir Archivo PDF/Imagen
                    </button>
                    <button 
                      className={`btn ${studyName ? 'btn-outline' : 'btn-outline'}`} 
                      style={{ padding: '1rem', color: studyName ? '#10b981' : '#ccc', borderColor: studyName ? '#10b981' : '#ccc', opacity: studyName ? 1 : 0.5 }}
                      disabled={!studyName}
                      onClick={handleOcrScan}
                    >
                      <Camera size={18} /> Sacar Foto / Escanear Papel
                    </button>
                  </div>
                  
                  {!studyName && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '1rem', textAlign: 'center' }}>
                      * Debes ingresar un nombre para habilitar la subida
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ----- TAB: CITAS ----- */}
          {activeTab === 'CITAS' && (
            <div className="mobile-section">
              <div className="section-header">
                <h3>{t('patient.agenda')}</h3>
                <button className="btn-view-study" onClick={() => setIsScheduling(true)} style={{ backgroundColor: 'var(--success)', color: 'white', borderColor: 'var(--success)' }}>
                  <Calendar size={14} /> {t('patient.schedule')}
                </button>
              </div>

              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '1rem' }}>{t('patient.upcoming')}</h4>
              
              {/* Pre-Consultation Notice */}
              <div style={{ backgroundColor: 'var(--accent-primary-transparent, rgba(14, 165, 233, 0.15))', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--accent-primary)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setIsPreConsultOpen(true)}>
                <AlertCircle size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '0.2rem', fontWeight: 700 }}>Turno mañana: Dra. Ríos</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>¿Qué querés consultarle mañana? Anotá tus prioridades acá para la Dra.</p>
                </div>
              </div>

              {uploadedFiles.filter(f => (f as any).isAppointment).length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '2rem' }}>No tenés turnos futuros agendados.</p>
              ) : (
                <div className="timeline" style={{ marginBottom: '2rem' }}>
                  {uploadedFiles.filter(f => (f as any).isAppointment).map((file, idx) => (
                    <div key={idx} className="timeline-item timeline-uploaded">
                      <div className="timeline-icon bg-green"><Calendar size={14} /></div>
                      <div className="timeline-content">
                        <h4>{file.name}</h4>
                        <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>{file.size}</span>
                        <p style={{ marginTop: '0.25rem' }}>Turno Confirmado</p>
                        <span className="timeline-doctor">Agendado hoy</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{t('patient.pastHistory')}</h4>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-icon bg-green"><Calendar size={14} /></div>
                  <div className="timeline-content">
                    <h4>Consulta Cardiológica</h4>
                    <p>15 de Marzo, 2026 • Finalizada</p>
                    <span className="timeline-doctor" style={{ backgroundColor: '#fee2e2', color: '#dc2626'}}>Acceso Revocado (Dr. Gómez)</span>
                    <div className="small-attachment" style={{ cursor: 'pointer' }} onClick={() => alert("Simulación de PDF: Receta_Aspirina.pdf")}>
                      <FileText size={12} />
                      <span>Receta_Aspirina.pdf</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----- TAB: PRIVACIDAD ----- */}
          {activeTab === 'PRIVACIDAD' && (
            <div className="mobile-section">
              <div className="section-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="var(--success)" /> 
                  {t('patient.privacyMgmt')}
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                {t('patient.privacyDesc')}
              </p>

              <div className="doctor-permission-card">
                <div className="doc-info">
                  <div className="doc-avatar">AR</div>
                  <div>
                    <h4>Dra. Ana Ríos</h4>
                    <p>Traumatología</p>
                  </div>
                </div>
                <button 
                  className={`toggle-btn ${docRiosAccess ? 'active' : 'revoked'}`}
                  onClick={() => setDocRiosAccess(!docRiosAccess)}
                >
                  {docRiosAccess ? <UserCheck size={16} /> : <UserX size={16} />}
                  {docRiosAccess ? t('patient.activeAccess') : t('patient.revoked')}
                </button>
              </div>

              <div className="doctor-permission-card">
                <div className="doc-info">
                  <div className="doc-avatar" style={{ backgroundColor: 'var(--bg-primary)', opacity: 0.6 }}>MG</div>
                  <div>
                    <h4>Dr. Martín Gómez</h4>
                    <p>Cardiología</p>
                  </div>
                </div>
                <button className="toggle-btn revoked">
                  <UserX size={16} />
                  {t('patient.revoked')}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* PREVIEW LIGHTBOX (Overlays the entire mobile mockup) */}
        {previewFile && (
          <div className="preview-lightbox">
            {/* Absolute positioned close button at top right */}
            <button 
              style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                right: '1.5rem', 
                zIndex: 9999, 
                backgroundColor: 'rgba(255,255,255,0.25)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '50%',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}
              onClick={() => setPreviewFile(null)}
            >
              <X color="white" size={28} strokeWidth={2.5} />
            </button>

            <div className="lightbox-nav">
              <span className="lightbox-title" style={{ color: 'white', paddingRight: '3rem' }}>{previewFile.name}</span>
            </div>
            
            <div className="lightbox-body">
              {previewFile.isImage ? (
                <img src={previewFile.url} alt="Visor Médico" className="lightbox-img" />
              ) : (
                <iframe src={previewFile.url} className="lightbox-iframe" title="Visor de PDF" />
              )}
            </div>
          </div>
        )}

        {/* SCHEDULING DRAWER (Bottom sheet) */}
        {isScheduling && (
          <div className="preview-lightbox" onClick={() => setIsScheduling(false)}>
            <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle"></div>
              <div style={{ 
                position: 'sticky', 
                top: 0, 
                backgroundColor: 'var(--bg-secondary)', 
                zIndex: 100, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>Agendar Nueva Cita</h3>
                <button className="icon-btn" onClick={() => setIsScheduling(false)} style={{ padding: '0.4rem' }}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="segment-control" style={{ marginBottom: '1.5rem' }}>
                <button 
                  className={`segment-btn ${schedulingType === 'DOCTOR' ? 'active' : ''}`} 
                  onClick={() => { setSchedulingType('DOCTOR'); setSelectedPlace(''); }}
                >
                  Médico
                </button>
                <button 
                  className={`segment-btn ${schedulingType === 'LAB' ? 'active' : ''}`} 
                  onClick={() => { setSchedulingType('LAB'); setSelectedPlace(''); }}
                >
                  Centro de Salud
                </button>
              </div>

              {schedulingType === 'DOCTOR' ? (
                <>
                  <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Elegir Especialidad</label>
                    <div style={{ position: 'relative' }}>
                      <Stethoscope className="input-icon" size={16} />
                      <select 
                        className="schedule-select" 
                        style={{ paddingLeft: '2.5rem' }}
                        value={selectedSpecialty}
                        onChange={(e) => { 
                          setSelectedSpecialty(e.target.value); 
                          setSelectedPlace(''); 
                        }}
                      >
                        <option value="">¿A qué especialidad buscás?</option>
                        <option value="Traumatología">Traumatología</option>
                        <option value="Cardiología">Cardiología</option>
                        <option value="Dermatología">Dermatología</option>
                        <option value="Clínica Médica">Clínica Médica</option>
                      </select>
                    </div>
                  </div>

                  {selectedSpecialty && (
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Profesionales en {selectedSpecialty}</label>
                      <div className="doctor-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                          { name: 'Dra. Ana Ríos', desc: 'Especialista Senior', rating: 4.8, reviews: 124, next: 'Hoy 16:00' },
                          { name: 'Dr. Julián Pérez', desc: 'Post-doctorado Harvard', rating: 4.9, reviews: 89, next: 'Mañana 09:00' },
                          { name: 'Dr. Martín Gómez', desc: 'Jefe de área', rating: 4.3, reviews: 215, next: 'Vie 03 Abr' }
                        ].filter(d => selectedSpecialty === 'Traumatología' ? d.name !== 'Dermatología' : true).map(doc => (
                          <div 
                            key={doc.name} 
                            className={`doctor-selection-card ${selectedPlace === doc.name ? 'active' : ''}`}
                            onClick={() => setSelectedPlace(doc.name)}
                            style={{ 
                              padding: '0.75rem', 
                              borderRadius: '12px', 
                              border: '1px solid var(--border-color)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.75rem',
                              cursor: 'pointer',
                              backgroundColor: selectedPlace === doc.name ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                              borderColor: selectedPlace === doc.name ? 'var(--accent-primary)' : 'var(--border-color)',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div className="doc-avatar" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>{doc.name.split(' ')[1].substring(0, 2).toUpperCase()}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h5 style={{ fontSize: '0.9rem', marginBottom: '0.1rem' }}>{doc.name}</h5>
                                {renderStars(doc.rating)}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                  {doc.rating} ({doc.reviews} {t('patient.reviews') || 'reseñas'})
                                </p>
                                <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>{doc.next}</span>
                              </div>
                            </div>
                            {selectedPlace === doc.name && <CheckCircle size={16} color="var(--accent-primary)" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPlace && (
                    <div style={{ marginTop: '-0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                      <MapPin size={12} /> <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { setMapLocation(selectedPlace); setIsMapOpen(true); }}>Ver ubicación del consultorio</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Elegir Centro de Diagnóstico</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 className="input-icon" size={16} />
                    <select 
                      className="schedule-select" 
                      style={{ paddingLeft: '2.5rem' }}
                      value={selectedPlace}
                      onChange={(e) => setSelectedPlace(e.target.value)}
                    >
                      <option value="">Seleccionar centro...</option>
                      <option value="Centro de Diagnóstico Sur">Centro de Diagnóstico Sur (Laboratorio/Rayos)</option>
                      <option value="Sanatorio Otamendi">Sanatorio Otamendi (Imágenes Complejas)</option>
                      <option value="Laboratorio Rossi">Laboratorio Rossi (Análisis/Genética)</option>
                    </select>
                  </div>
                  {selectedPlace && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                      <MapPin size={12} /> <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { setMapLocation(selectedPlace); setIsMapOpen(true); }}>Ver ubicación en mapa</span>
                    </div>
                  )}
                </div>
              )}

              {selectedPlace && (
                <>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Días Disponibles - Abril 2026</label>
                    <div className="date-selector">
                      {['01', '02', '03', '06'].map(d => (
                        <div 
                          key={d} 
                          className={`date-card ${selectedDay === d ? 'active' : ''}`} 
                          onClick={() => setSelectedDay(d)}
                        >
                          <span className="day">{d === '01' ? 'Mie' : d === '02' ? 'Jue' : d === '03' ? 'Vie' : 'Lun'}</span>
                          <span className="date">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Horarios para {selectedPlace}</label>
                    <div className="time-selector">
                      {['08:00', '09:30', '11:15', '14:30', '16:00'].map(h => (
                        <span 
                          key={h} 
                          className={`time-badge ${selectedHour === h ? 'active' : ''}`} 
                          onClick={() => setSelectedHour(h)}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button 
                className={`btn btn-block ${selectedPlace ? 'btn-primary' : 'btn-outline'}`} 
                style={{ marginTop: '1rem', padding: '1rem', opacity: selectedPlace ? 1 : 0.5 }}
                disabled={!selectedPlace}
                onClick={confirmAppointment}
              >
                Confirmar Turno en {selectedPlace || '...'}
              </button>
            </div>
          </div>
        )}

        {/* Upload Drawer Mockup overlay */}
        {isUploading && (
          <div className="upload-drawer">
            <div className="drawer-content">
              <h4>Subiendo estudio a AWS S3...</h4>
              <p>Encriptando archivo con AES-256 (Privacidad de salud).</p>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <span>{uploadProgress}%</span>
                <span>{uploadProgress === 100 ? 'Procesando...' : 'Obteniendo URL firmada...'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button (Symptom Diary) */}
        {!isOcrScanning && !isScheduling && !previewFile && (
          <button className="fab-symptom" onClick={() => setIsSymptomOpen(true)} title="Anotar un síntoma rápido">
            <Edit2 size={24} />
          </button>
        )}

        {/* --- MODALS EXTRA (MVP UX) --- */}
        
        {/* OCR Scanner Mockup */}
        {isOcrScanning && (
          <div className="ocr-scanner">
            <h3 style={{ color: 'white', marginBottom: '2rem', fontWeight: 600 }}>Enfocá el Análisis de Sangre</h3>
            <div className="ocr-box">
              <div className="ocr-laser"></div>
            </div>
            <p style={{ color: '#10b981', fontWeight: 600 }}>Analizando Biomarcadores OCR...</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Procesamiento Seguro Nativo</p>
          </div>
        )}

        {/* Symptom Modal */}
        {isSymptomOpen && (
          <div className="modal-overlay" onClick={() => setIsSymptomOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: '1rem' }}>Diario de Síntomas</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Registrá lo que sentís en este momento para no olvidarlo en tu próxima visita.</p>
              <textarea placeholder="Ej: Me duele mucho la rodilla al subir escaleras..." style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'none', marginBottom: '1rem' }}></textarea>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsSymptomOpen(false)}>Cancelar</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setIsSymptomOpen(false)}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* Pre-Consultation Mockup Modal */}
        {isPreConsultOpen && (
          <div className="modal-overlay" onClick={() => setIsPreConsultOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>UX de Preparación</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Anotá tus dudas. Se añadirán encriptadas al panel de tu doctor antes de entrar.</p>
              
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input type="checkbox" id="q1" defaultChecked />
                  <label htmlFor="q1" style={{ fontSize: '0.85rem' }}>Renovar receta Enalapril</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input type="checkbox" id="q2" defaultChecked />
                  <label htmlFor="q2" style={{ fontSize: '0.85rem' }}>Dolor de cabeza matutino</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="text" placeholder="+ Agregar tema" style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem', width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                </div>
              </div>
              
              <button className="btn btn-primary btn-block" onClick={() => setIsPreConsultOpen(false)}>Adjuntar a mi Historia Confidencial</button>
            </div>
          </div>
        )}

        {/* Just-In-Time Glossary */}
        {showGlossary && (
          <div className="modal-overlay" onClick={() => setShowGlossary(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                <AlertCircle size={20} /> Glosario Clínico
              </h3>
              <h4 style={{ marginBottom: '0.5rem' }}>Glucemia en Ayunas</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Mide la cantidad de un azúcar llamado glucosa en una muestra de sangre. Se usa para predecir y controlar la pre-diabetes y la diabetes.
              </p>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                <li><strong style={{ color: '#059669' }}>Normal:</strong> 70 a 99 mg/dL</li>
                <li><strong style={{ color: '#d97706' }}>Pre-Diabetes:</strong> 100 a 125 mg/dL</li>
                <li><strong style={{ color: '#dc2626' }}>Diabetes:</strong> 126 mg/dL superior</li>
              </ul>
              <button className="btn btn-block btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => setShowGlossary(false)}>Entendido</button>
            </div>
          </div>
        )}

        {/* Mobile Navbar Bottom */}
        <div className="mobile-navbar">
          <button className={`nav-item ${activeTab === 'HOME' ? 'active' : ''}`} onClick={() => setActiveTab('HOME')} style={{ cursor: 'pointer' }}>
            <Activity size={20} />
            <span>{t('nav.home')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'ESTUDIOS' ? 'active' : ''}`} onClick={() => setActiveTab('ESTUDIOS')} style={{ cursor: 'pointer' }}>
            <FileText size={20} />
            <span>{t('nav.studies')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'CITAS' ? 'active' : ''}`} onClick={() => setActiveTab('CITAS')} style={{ cursor: 'pointer' }}>
            <Calendar size={20} />
            <span>{t('nav.appointments')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'PRIVACIDAD' ? 'active' : ''}`} onClick={() => setActiveTab('PRIVACIDAD')} style={{ cursor: 'pointer' }}>
            <ShieldCheck size={20} />
            <span>{t('nav.privacy')}</span>
          </button>
        </div>

        {/* QR Handshake Modal */}
        {isQrOpen && (
          <div className="modal-overlay" style={{ zIndex: 10001 }}>
            <div className="modal-content" style={{ textAlign: 'center', maxWidth: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="icon-btn" onClick={() => setIsQrOpen(false)}><X size={24} /></button>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>{t('patient.qrShare')}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {t('patient.qrDesc')}
              </p>
              
              <div style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '20px', 
                display: 'inline-block',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem'
              }}>
                <QrCode size={180} color="#0f172a" />
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                color: 'var(--accent-primary)',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                <Activity size={16} className="pulse" />
                <span>{t('patient.qrWaiting')}</span>
              </div>

              <button 
                className="btn btn-primary btn-block" 
                style={{ marginTop: '1.5rem' }}
                onClick={() => setIsQrOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Notifications Drawer */}
        {isNotifOpen && (
          <div className="modal-overlay" onClick={() => setIsNotifOpen(false)}>
            <div className="modal-content" style={{ maxHeight: '80%', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell size={20} color="var(--accent-primary)" /> Notificaciones</h3>
                <button className="icon-btn" onClick={() => setIsNotifOpen(false)}><X size={20} /></button>
              </div>
              <div style={{ overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', position: 'relative', backgroundColor: n.unread ? 'rgba(14, 165, 233, 0.05)' : 'transparent' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem', color: n.unread ? 'var(--accent-primary)' : 'inherit' }}>{n.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.desc}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'block' }}>{n.time}</span>
                    {n.unread && <div style={{ position: 'absolute', top: '1.2rem', right: '1rem', width: '6px', height: '6px', backgroundColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>}
                  </div>
                ))}
              </div>
              <button className="btn btn-outline btn-block" style={{ marginTop: '1.5rem' }} onClick={() => { 
                setNotifications(prev => prev.map(n => ({...n, unread: false})));
                setIsNotifOpen(false); 
              }}>
                Marcar todas como leídas
              </button>
            </div>
          </div>
        )}

        {/* Map Simulation Modal */}
        {isMapOpen && (
          <div className="modal-overlay" onClick={() => setIsMapOpen(false)}>
            <div className="modal-content" style={{ padding: '0', overflow: 'hidden', height: '500px' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h3 style={{ fontSize: '1rem' }}>Ubicación</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mapLocation}</p>
                </div>
                <button className="icon-btn" onClick={() => setIsMapOpen(false)}><X size={20} /></button>
              </div>
              <div style={{ flex: 1, backgroundColor: '#e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Map size={48} color="var(--text-secondary)" style={{ opacity: 0.3 }} />
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cargando Google Maps...</p>
                
                {/* Simulated Map Pin */}
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <MapPin size={32} color="var(--danger)" fill="var(--danger)" />
                  <div style={{ height: '4px', width: '4px', backgroundColor: 'black', borderRadius: '50%', margin: '2px auto', opacity: 0.2 }}></div>
                </div>

                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
                  <button className="btn btn-primary btn-block" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} onClick={() => alert("Abriendo Google Maps en tu dispositivo...")}>
                    Iniciar Navegación GPS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

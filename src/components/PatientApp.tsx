import { Upload, FileText, Calendar, Activity, ShieldCheck, UserX, UserCheck, CheckCircle, Eye, X, Camera, Edit2, AlertCircle, LogOut, QrCode, Sun, Moon, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceArea } from 'recharts';
import { useTranslation } from 'react-i18next';

type UploadedFile = {
  name: string;
  size: string;
  url: string;
  isImage: boolean;
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
  const [estudiosSubTab, setEstudiosSubTab] = useState<'ARCHIVOS' | 'TENDENCIAS'>('ARCHIVOS');
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [isSymptomOpen, setIsSymptomOpen] = useState(false);
  const [isPreConsultOpen, setIsPreConsultOpen] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [labData, setLabData] = useState([
    { date: 'Oct', glucosa: 88 },
    { date: 'Nov', glucosa: 92 },
    { date: 'Dic', glucosa: 104 },
    { date: 'Ene', glucosa: 110 },
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
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            url: fileUrl,
            isImage
          }, ...prev]);
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
      setEstudiosSubTab('TENDENCIAS');
      // Append the scanned value magically
      setLabData(prev => [...prev, { date: 'Hoy', glucosa: 85 }]);
    }, 2500);
  };

  const confirmAppointment = () => {
    setIsScheduling(false);
    // Mock the new appointment being added to the timeline
    setUploadedFiles(prev => [{
      name: 'Consulta Dermatológica',
      size: 'Dra. Méndez • 28 Mar, 10:00',
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
                <button className="action-btn upload-btn" onClick={handleUploadClick}>
                  <Upload size={20} />
                  <span>{t('patient.uploadStudy')}</span>
                </button>
                <button className="action-btn outline-btn" onClick={() => setIsScheduling(true)}>
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
                  {uploadedFiles.slice(0, 3).map((file, idx) => {
                    const isAppt = (file as any).isAppointment;
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
                          <p style={{ marginTop: '0.25rem' }}>{isAppt ? 'Turno Confirmado' : 'Subido exitosamente • Pendiente'}</p>
                          <span className="timeline-doctor">{isAppt ? 'Agendado hoy' : 'Compartido con Médicos Activos'}</span>
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
                  className={`segment-btn ${estudiosSubTab === 'ARCHIVOS' ? 'active' : ''}`} 
                  onClick={() => setEstudiosSubTab('ARCHIVOS')}
                >
                  <FileText size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {t('patient.liveFiles')}
                </button>
                <button 
                  className={`segment-btn ${estudiosSubTab === 'TENDENCIAS' ? 'active' : ''}`} 
                  onClick={() => setEstudiosSubTab('TENDENCIAS')}
                >
                  <Activity size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {t('patient.trends')}
                </button>
              </div>

              {estudiosSubTab === 'ARCHIVOS' && (
                <>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '0.6rem' }} onClick={handleUploadClick}>
                      <Upload size={14} /> {t('patient.uploadPDF')}
                    </button>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', color: '#10b981', borderColor: '#10b981' }} onClick={handleOcrScan}>
                      <Camera size={14} /> {t('patient.scanPaper')}
                    </button>
                  </div>
                  <div className="timeline">
                    {uploadedFiles.filter(f => !(f as any).isAppointment).map((file, idx) => (
                      <div key={idx} className="timeline-item timeline-uploaded">
                        <div className="timeline-icon bg-blue"><CheckCircle size={14} /></div>
                        <div className="timeline-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4>{file.name}</h4>
                              <span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>{file.size}</span>
                            </div>
                            <button className="btn-view-study" onClick={() => setPreviewFile(file)}>
                              <Eye size={14} /> {t('patient.view')}
                            </button>
                          </div>
                          <p style={{ marginTop: '0.25rem' }}>Subido exitosamente • En nube segura</p>
                          <span className="timeline-doctor">Compartido con Médicos Activos</span>
                        </div>
                      </div>
                    ))}
                    <div className="timeline-item">
                      <div className="timeline-icon"><FileText size={14} /></div>
                      <div className="timeline-content">
                        <h4>Análisis de Laboratorio - Sangre</h4>
                        <p>12 Enero, 2026</p>
                        <span className="timeline-doctor">Centro de Diagnóstico Sur</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {estudiosSubTab === 'TENDENCIAS' && (
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem 1rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Glucemia en Ayunas</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mg/dL (Últimos 6 meses)</p>
                    </div>
                    <button className="icon-btn" onClick={() => setShowGlossary(true)} style={{ backgroundColor: '#e0f2fe', color: 'var(--accent-primary)', padding: '0.4rem', borderRadius: '50%' }}>
                      <AlertCircle size={18} />
                    </button>
                  </div>

                  <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={labData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} domain={[70, 130]} />
                        {/* Zonas de color: Verde (Normal), Amarillo (Pre), Rojo (Alto) */}
                        <ReferenceArea y1={70} y2={100} fill="#d1fae5" fillOpacity={0.3} />
                        <ReferenceArea y1={100} y2={125} fill="#fef3c7" fillOpacity={0.4} />
                        <ReferenceArea y1={125} y2={130} fill="#fee2e2" fillOpacity={0.3} />
                        
                        <Line type="monotone" dataKey="glucosa" stroke="var(--text-primary)" strokeWidth={3} dot={{ r: 5, fill: 'var(--bg-primary)', strokeWidth: 2 }} activeDot={{ r: 7, fill: 'var(--accent-primary)' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {labData.length > 4 && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <CheckCircle size={16} /> Gran trabajo! Tu glucosa bajó tras la dieta.
                    </div>
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
              <div style={{ backgroundColor: '#e0f2fe', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #7dd3fc', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setIsPreConsultOpen(true)}>
                <AlertCircle size={20} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Turno mañana: Dra. Ríos</h5>
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
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.15rem' }}>Agendar Nueva Cita</h3>
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Especialidad o Profesional</label>
                <select className="schedule-select">
                  <option>Dra. Ana Ríos (Tu médica actual)</option>
                  <option>Dermatología - Buscar profesional</option>
                  <option>Clínica Médica - Buscar profesional</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Marzo 2026</label>
                <div className="date-selector">
                  <div className="date-card">
                    <span className="day">Mie</span>
                    <span className="date">25</span>
                  </div>
                  <div className="date-card">
                    <span className="day">Jue</span>
                    <span className="date">26</span>
                  </div>
                  <div className="date-card active">
                    <span className="day">Vie</span>
                    <span className="date">27</span>
                  </div>
                  <div className="date-card">
                    <span className="day">Lun</span>
                    <span className="date">30</span>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Horario disponible</label>
                <div className="time-selector">
                  <span className="time-badge">09:00</span>
                  <span className="time-badge active">10:00</span>
                  <span className="time-badge disabled">10:30</span>
                  <span className="time-badge">11:00</span>
                  <span className="time-badge disabled">11:30</span>
                  <span className="time-badge">14:00</span>
                </div>
              </div>

              <button className="btn btn-primary btn-block" style={{ marginTop: '1rem', padding: '1rem' }} onClick={confirmAppointment}>
                Confirmar Turno Seguro
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
                {t('patient.view')}
              </button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}

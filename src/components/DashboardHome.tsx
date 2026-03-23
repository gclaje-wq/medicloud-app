import { useState } from 'react';
import { Activity, FileText, Lock, ShieldAlert, CheckCircle, QrCode, Eye } from 'lucide-react';

export function DashboardHome({ patientName = 'Gonzalo' }: { patientName?: string }) {
  const [isConsulting, setIsConsulting] = useState(false);

  // Home State (Waiting for Patient QR)
  if (!isConsulting) {
    return (
      <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '3rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
            <QrCode size={64} color="var(--accent-primary)" style={{ margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ marginBottom: '1rem' }}>Esperando Paciente</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Para iniciar la atención segura, el paciente debe generar su <strong>QR Dinámico</strong> en la APP y vos debés escanearlo o ingresar el código de enlace temporal.
            </p>
            <button 
              className="btn btn-primary btn-block" 
              onClick={() => setIsConsulting(true)}
              style={{ padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
            >
              Simular Escaneo de QR Exitoso
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '1rem', fontWeight: 600 }}>
              ✓ Handshake 2FA (Notificación Push al paciente requerida)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Consultation State (Modo Consulta Minimalista)
  return (
    <div className="content-area" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Modo Consulta Activa</h1>
        <button className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => setIsConsulting(false)}>
          Finalizar Sesión E2E
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-md)', marginBottom: '1.5rem' }}>
        {/* Header with Patient Info and Sandboxed Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
              {patientName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{patientName} Gómez <span style={{ fontSize: '0.85rem', backgroundColor: 'var(--bg-primary)', padding: '0.2rem 0.6rem', borderRadius: '99px', marginLeft: '0.5rem', fontWeight: 500 }}>45 años</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>DNI: 28.123.456 | O.S: Swiss Medical</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#d1fae5', color: '#059669', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>
            <Lock size={14} />
            <span>Token Activo • Expira: 14:59 min</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Critical Alerts Panel */}
          <div style={{ backgroundColor: '#fee2e2', borderRadius: '16px', padding: '1.5rem', border: '1px solid #fca5a5' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>
              <ShieldAlert size={20} /> Alertas Críticas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <strong style={{ color: '#dc2626', display: 'block', marginBottom: '0.25rem' }}>ALERGIA SEVERA</strong>
                <span style={{ color: '#1e293b', fontSize: '0.9rem' }}>Penicilina y derivados (Reacción Anafiláctica confirmada)</span>
              </div>
            </div>
          </div>

          {/* Current Medication */}
          <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>
              <Activity size={20} color="var(--accent-primary)" /> Medicación Activa
              <span style={{ fontSize: '0.65rem', marginLeft: 'auto', backgroundColor: '#d1fae5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '99px' }}>Compartido por Paciente</span>
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }}/> 
                <div>
                  <strong>Enalapril 10mg</strong>
                  <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.15rem' }}>1 comprimido c/ 12hs (Hipertensión)</span>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }}/> 
                <div>
                  <strong>Aspirina Prevent 81mg</strong>
                  <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.15rem' }}>1 comprimido (Cena)</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical History & Sandbox View */}
        <div style={{ marginTop: '1.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>
            <FileText size={20} color="var(--accent-primary)" /> Estudios Clínicos Aprobados
          </h3>
          
          <div style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)' }}>
            <Lock size={36} color="var(--text-secondary)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Visor DICOM / Web Seguro (Sandboxed)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
              Los estudios fluyen hacia este visor vía <strong>WebSocket encriptado (Solo Lectura)</strong>. La descarga física y el guardado local se encuentran bloqueados en cumplimiento de la Ley 26.529.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} /> Ver Resonancia (Rodilla)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

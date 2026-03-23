import { Search, Bell, ChevronDown } from 'lucide-react';

export function Topbar() {
  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={18} color="var(--text-secondary)" />
        <input type="text" placeholder="Buscar paciente, DNI o estudio..." />
      </div>
      
      <div className="user-profile">
        <button className="icon-btn" style={{ position: 'relative' }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            backgroundColor: 'var(--danger)',
            width: '8px',
            height: '8px',
            borderRadius: '50%'
          }}></span>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div className="avatar">DR</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Dra. Ana Ríos</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Traumatología</span>
          </div>
          <ChevronDown size={16} color="var(--text-secondary)" />
        </div>
      </div>
    </header>
  );
}

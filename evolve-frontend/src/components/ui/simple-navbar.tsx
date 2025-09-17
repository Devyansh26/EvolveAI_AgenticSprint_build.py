export const SimpleNavbar = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      color: 'white'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
        CFOx.ai
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
          Home
        </button>
        <button style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
          How it Works
        </button>
        <button style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
          About
        </button>
        <button style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
          Contact Us
        </button>
      </div>
    </div>
  );
};

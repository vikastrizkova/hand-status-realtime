import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [inHand, setInHand] = useState(null);

  useEffect(() => {
    socket.on('state-update', (data) => {
      setInHand(data.inHand);
    });

    return () => {
      socket.off('state-update');
    };
  }, []);

  if (inHand === null) {
    return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Подключение...</div>;
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Состояние: {inHand ? '✅ В руке' : '❌ Не в руке'}</h2>
      
      <button
        onClick={() => socket.emit('change-state', !inHand)}
        style={{
          padding: '12px 24px',
          fontSize: 16,
          cursor: 'pointer',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: 8
        }}
      >
        Переключить состояние
      </button>
    </div>
  );
}

export default App;
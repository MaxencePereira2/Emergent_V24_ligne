import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Redirect to the static Alesium site
    window.location.replace('/index.html');
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif',
      background: '#F6F7F8',
      color: '#1E2329'
    }}>
      <p>Redirection vers le site Alesium...</p>
    </div>
  );
}

export default App;

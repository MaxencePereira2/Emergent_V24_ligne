import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Le contenu HTML est déjà dans le DOM via index.html
    // On charge juste le JavaScript pour l'interactivité
    
    const script = document.createElement('script');
    script.src = '/assets/js/app.js';
    script.async = true;
    document.body.appendChild(script);
    
  }, []);

  // Ne rien rendre, le contenu est déjà dans index.html
  return null;
}

export default App;

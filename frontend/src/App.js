import { useEffect, useState } from "react";

function App() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Load the Alesium static site content
    fetch('/index.html')
      .then(response => response.text())
      .then(html => {
        // Parse the HTML and extract the body content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get the body content
        const bodyContent = doc.body.innerHTML;
        setHtmlContent(bodyContent);
        
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/css/app.css';
        document.head.appendChild(link);
        
        // Load fonts
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        // Set page title
        document.title = 'Alesium — Du concept à la production fiable et rentable';
        
        // Load and execute the JavaScript after a short delay
        setTimeout(() => {
          const script = document.createElement('script');
          script.src = '/assets/js/app.js';
          script.onload = () => {
            // Forcer la ré-initialisation de la FAQ après le chargement du JS
            const faqQuestions = document.querySelectorAll('.faq-question');
            faqQuestions.forEach(question => {
              question.addEventListener('click', () => {
                const isOpen = question.getAttribute('aria-expanded') === 'true';
                const answer = question.nextElementSibling;
                
                // Close all other FAQ items
                faqQuestions.forEach(otherQuestion => {
                  if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    otherAnswer.classList.remove('open');
                  }
                });
                
                // Toggle current FAQ item
                if (isOpen) {
                  question.setAttribute('aria-expanded', 'false');
                  answer.classList.remove('open');
                } else {
                  question.setAttribute('aria-expanded', 'true');
                  answer.classList.add('open');
                }
              });
            });
          };
          document.head.appendChild(script);
        }, 500);
      })
      .catch(error => {
        console.error('Error loading Alesium site:', error);
        setHtmlContent('<div style="padding: 40px; text-align: center; font-family: Inter, sans-serif;">Erreur de chargement du site Alesium</div>');
      });
  }, []);

  if (!htmlContent) {
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
        <p>Chargement du site Alesium...</p>
      </div>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export default App;

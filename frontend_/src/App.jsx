import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Asegúrate de instalar axios
import '/public/styles/style.css';

const App = () => {
  const [showVideo, setShowVideo] = useState(true);
  const [latestImagePath, setLatestImagePath] = useState('');

  useEffect(() => {
    const fetchLatestImage = async () => {
      try {
        const response = await axios.get('http://localhost:3000/latest-image');
        setLatestImagePath(response.data);
      } catch (error) {
        console.error('Error al obtener la última imagen:', error);
      }
    };

    fetchLatestImage();
    const interval = setInterval(fetchLatestImage, 2000); // Cada 5 segundos

    return () => {
      clearInterval(interval);
    };
  }, []);

  const toggleVisibility = () => {
    setShowVideo(!showVideo);
  };

  return (
    <div className="centrar">
      <img src="/multimedia/Logo.jpg" className="logo" alt="Logo"/>
      <img src="/multimedia/Logo.jpg" className="logo2" alt="Logo2"/>

      {showVideo && (
        <div className="video" id="videoSinte">
          <video autoPlay loop muted>
            <source src="/multimedia/Sintecrom 480px.mp4" type="video/mp4"/>
          </video>
        </div>
      )}

      <button className="btn" onClick={toggleVisibility}>
        Mostrar / Ocultar
      </button>

      {!showVideo && (
        <main className="main" id="main">
          <div className="container">
            <h1 className="noticia">Noticias Sintecrom</h1>
            <div className="divisor">
              <img className="imagen" alt="Latest" src= {latestImagePath} />
              <p className="texto">
                ¡Feliz Cumpleaños, Jose!
                <br/> Sintecrom te desea lo mejor en tu día.
                <br/> Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
    
  )
  
};

export default App;

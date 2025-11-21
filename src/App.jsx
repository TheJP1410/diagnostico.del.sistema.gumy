import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Flower, ShieldPlus, Music, Zap, Shield, Bot, Snowflake, X, Camera, ChevronRight } from 'lucide-react';

// --- COMPONENTES VISUALES ---

const PinkLily = ({ style }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="absolute animate-float opacity-90 pointer-events-none" style={style}>
    <defs>
      <linearGradient id="lilyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="10%" style={{ stopColor: '#fce7f3', stopOpacity: 1 }} />
        <stop offset="60%" style={{ stopColor: '#f472b6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="stamenGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#bef264', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M50 100 Q55 80 50 65" stroke="#86efac" strokeWidth="3" fill="none" />
    <g transform="translate(50, 55)">
      <path d="M0 0 Q-15 -20 0 -35 Q15 -20 0 0" fill="url(#lilyGradient)" stroke="#f472b6" strokeWidth="0.5" transform="rotate(30) scale(0.9)" />
      <path d="M0 0 Q-15 -20 0 -35 Q15 -20 0 0" fill="url(#lilyGradient)" stroke="#f472b6" strokeWidth="0.5" transform="rotate(150) scale(0.9)" />
      <path d="M0 0 Q-15 -20 0 -35 Q15 -20 0 0" fill="url(#lilyGradient)" stroke="#f472b6" strokeWidth="0.5" transform="rotate(270) scale(0.9)" />
      <path d="M0 0 Q-18 -25 0 -40 Q18 -25 0 0" fill="url(#lilyGradient)" stroke="#f9a8d4" strokeWidth="0.5" transform="rotate(90)" />
      <path d="M0 0 Q-18 -25 0 -40 Q18 -25 0 0" fill="url(#lilyGradient)" stroke="#f9a8d4" strokeWidth="0.5" transform="rotate(210)" />
      <path d="M0 0 Q-18 -25 0 -40 Q18 -25 0 0" fill="url(#lilyGradient)" stroke="#f9a8d4" strokeWidth="0.5" transform="rotate(330)" />
      <g stroke="url(#stamenGradient)" strokeWidth="1.5" fill="none">
        <path d="M0 0 Q-5 -15 -8 -20" />
        <path d="M0 0 Q5 -15 8 -20" />
        <path d="M0 0 Q0 -18 0 -22" />
      </g>
      <circle cx="-8" cy="-20" r="2" fill="#fde047" />
      <circle cx="8" cy="-20" r="2" fill="#fde047" />
      <circle cx="0" cy="-22" r="2" fill="#fde047" />
      <circle cx="0" cy="0" r="3" fill="#fef08a" stroke="#bef264" strokeWidth="1" />
    </g>
  </svg>
);

// Componente de Habilidad (HUD)
const AbilityIcon = ({ k, icon: Icon, label, active, onClick, cooldown, ready }) => (
  <div className="flex flex-col items-center gap-1 group relative">
    <button 
      onClick={onClick}
      disabled={!active}
      className={`
        w-12 h-12 md:w-16 md:h-16 border-2 flex items-center justify-center transition-all duration-200 relative overflow-hidden
        ${active ? 'border-white bg-slate-800/80 hover:bg-slate-700 cursor-pointer active:scale-95' : 'border-slate-600 bg-slate-900/50 opacity-50 cursor-not-allowed'}
        ${ready ? 'animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.6)] border-emerald-400' : ''}
      `}
    >
      <Icon className={`w-6 h-6 md:w-8 md:h-8 ${ready ? 'text-emerald-400' : 'text-white'}`} />
      <span className="absolute top-0.5 left-1 text-[8px] md:text-[10px] font-bold text-slate-400">{k}</span>
    </button>
    <span className="text-[10px] uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">{label}</span>
  </div>
);

export default function App() {
  const [hp, setHp] = useState(20);
  const [isHealed, setIsHealed] = useState(false);
  const [lilies, setLilies] = useState([]);
  const [musicActive, setMusicActive] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { id: 0, sender: "SISTEMA", text: "Partida encontrada en: MAPA DE LIRIOS", type: "system" },
    { id: 1, sender: "SISTEMA", text: "Conexión con Pocket Sage establecida.", type: "system" }
  ]);

  // Estados para habilidades y galería
  const [shieldActive, setShieldActive] = useState(false);
  const [calmActive, setCalmActive] = useState(false);
  const [ultReady, setUltReady] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const audioRef = useRef(null);
  const btnRef = useRef(null);
  const chatEndRef = useRef(null);

  // --- CONFIGURACIÓN DE FOTOS ---
  // JEAN: Aquí pon los links reales de las fotos de ella.
  // Puedes usar links de Imgur, Discord, o fotos que tengas en la carpeta 'public'.
  const galleryPhotos = [
    "https://i.ibb.co/dJQCmtMZ/Imagen-de-Whats-App-2025-11-14-a-las-15-26-42-edf4e3a4.jpg", // Foto 1 (Ejemplo)
    "https://i.ibb.co/4ZGDQ81Y/Imagen-de-Whats-App-2025-10-08-a-las-18-32-34-66b630b6.jpg", // Foto 2 (Ejemplo)
    "https://i.ibb.co/YTfmBNKS/Imagen-de-Whats-App-2025-11-14-a-las-15-26-42-0b4b452c.jpg", // Foto 3 (Ejemplo)
  ];

  const sageQuotes = [
    "Aquí tienes curación.", "No te mueras todavía.", "¡Aguanta, Raze!", 
    "Cuidado ahí fuera.", "Un poquito de magia para ti.", "Te cubro la espalda.", 
    "Respira, estoy contigo."
  ];

  useEffect(() => {
    if (audioRef.current) {
      if (musicActive) audioRef.current.play().catch(e => setMusicActive(false));
      else audioRef.current.pause();
    }
  }, [musicActive]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'e') handleHeal();
      if (e.key.toLowerCase() === 'c') handleShield();
      if (e.key.toLowerCase() === 'q') handleCalm();
      if (e.key.toLowerCase() === 'x') handleUlt();
      if (e.key === 'Escape') setShowGallery(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hp, ultReady]);

  const generateRandomPosition = () => ({
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 90}%`,
    animationDelay: `${Math.random() * 2}s`,
    transform: `scale(${Math.random() * 0.7 + 0.5}) rotate(${Math.random() * 60 - 30}deg)`
  });

  const addFloatingText = (text, x, y, color = 'text-emerald-400') => {
    const newText = { id: Date.now(), x, y, text, color };
    setFloatingTexts(prev => [...prev, newText]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== newText.id));
    }, 1000);
  };

  const addChatMessage = (text, sender = "Sage (Jean)", type = "team") => {
    setChatMessages(prev => [...prev, { id: Date.now(), sender, text, type }]);
  };

  const handleHeal = () => {
    if (hp < 100) {
      const healAmount = 20;
      const newHp = Math.min(hp + healAmount, 100);
      setHp(newHp);

      const rect = btnRef.current?.getBoundingClientRect() || { left: window.innerWidth/2, top: window.innerHeight/2, width: 0 };
      const x = rect.left + rect.width / 2 + (Math.random() * 40 - 20);
      const y = rect.top - 20;
      addFloatingText(`+${healAmount}`, x, y);

      const randomQuote = sageQuotes[Math.floor(Math.random() * sageQuotes.length)];
      addChatMessage(randomQuote);

      if (newHp === 100) {
        setIsHealed(true);
        setUltReady(true);
        addChatMessage("¡Ulti Lista! Presiona X para celebrar.", "SISTEMA", "alert");
        
        const newLilies = Array.from({ length: 10 }).map((_, i) => ({
          id: i,
          style: generateRandomPosition()
        }));
        setLilies(newLilies);
      }
    }
  };

  const handleShield = () => {
    if (!shieldActive) {
      setShieldActive(true);
      addChatMessage("Escudo de amor activado.", "Sage (Jean)", "team");
      setTimeout(() => setShieldActive(false), 3000);
    }
  };

  const handleCalm = () => {
    if (!calmActive) {
      setCalmActive(true);
      addChatMessage("Relajando el ambiente...", "Sage (Jean)", "team");
      setTimeout(() => setCalmActive(false), 4000);
    }
  };

  const handleUlt = () => {
    if (ultReady) {
      addChatMessage("¡A LUCHAR! (Con mucho cariño)", "Sage (Jean)", "alert");
      setUltReady(false);
      const extraLilies = Array.from({ length: 20 }).map((_, i) => ({
        id: `ult-${Date.now()}-${i}`,
        style: generateRandomPosition()
      }));
      setLilies(prev => [...prev, ...extraLilies]);
    }
  };

  const getHealthColor = () => {
    if (hp < 40) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]';
    if (hp < 80) return 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]';
    return 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]';
  };

  return (
    <div className={`min-h-screen bg-slate-900 text-white font-sans overflow-hidden relative selection:bg-pink-200 selection:text-pink-900 transition-colors duration-1000 ${calmActive ? 'grayscale-[50%] blur-[1px]' : ''}`}>
      
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* --- GALERÍA LATERAL DESLIZANTE --- */}
      <div className={`fixed inset-0 z-[60] pointer-events-none ${showGallery ? 'pointer-events-auto' : ''}`}>
        {/* Fondo oscuro (Backdrop) */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${showGallery ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowGallery(false)}
        />
        
        {/* Panel Lateral */}
        <div className={`absolute top-0 left-0 h-full w-full max-w-sm bg-slate-900/95 border-r border-slate-700 shadow-2xl transform transition-transform duration-500 ease-out p-6 flex flex-col ${showGallery ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3 text-orange-500">
              <Camera className="w-6 h-6" />
              <h2 className="text-xl font-bold font-mono tracking-wider uppercase">Galería</h2>
            </div>
            <button 
              onClick={() => setShowGallery(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Grid de Fotos */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded mb-4 text-sm text-orange-200">
              <p className="flex items-center gap-2 mb-1 font-bold"><Zap className="w-4 h-4"/> MVP GG :p</p>
              <p className="opacity-80 text-xs">Aquí algunas fotos para que veas lo linda q te ves sonriendo :p</p>
            </div>

            {galleryPhotos.map((photo, index) => (
              <div key={index} className="group relative aspect-[4/5] bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700 hover:border-orange-500 transition-all duration-300">
                <img src={photo} alt={`Gumynola ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-xs font-mono text-orange-400 bg-black/50 px-2 py-1 rounded backdrop-blur-md border border-orange-500/30">
                    IMG_00{index + 1}.RAW
                  </span>
                </div>
              </div>
            ))}
            
            <div className="text-center py-8 opacity-50 text-xs font-mono">
              --- FIN DEL CARRETE ---
            </div>
          </div>
        </div>
      </div>

      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950"></div>
      </div>

      {/* Textos Flotantes */}
      {floatingTexts.map(ft => (
        <div key={ft.id} className={`absolute pointer-events-none font-bold text-xl animate-fade-up-disappear z-50 ${ft.color}`} style={{ left: ft.x, top: ft.y }}>
          {ft.text}
        </div>
      ))}

      {/* Lirios */}
      {lilies.map((lily) => (
        <PinkLily key={lily.id} style={lily.style} />
      ))}

      {/* Boom Bot */}
      <div className="absolute bottom-20 animate-patrol pointer-events-none z-0 opacity-50">
        <Bot className="w-12 h-12 text-orange-500 animate-bounce" />
      </div>

      {/* Chat */}
      <div className="absolute bottom-32 left-4 z-40 w-full max-w-[280px] md:max-w-xs pointer-events-none select-none hidden md:block">
        <div className="flex flex-col gap-1 opacity-80 font-mono text-xs md:text-sm text-shadow-sm">
          {chatMessages.slice(-5).map((msg) => (
            <div key={msg.id} className="animate-fade-in-right bg-slate-900/50 px-2 py-1 rounded backdrop-blur-sm border-l-2 border-slate-700">
              {msg.type === 'system' && <span className="text-slate-400">{msg.text}</span>}
              {msg.type === 'team' && <><span className="text-emerald-400">(Equipo) {msg.sender}: </span><span className="text-white">{msg.text}</span></>}
              {msg.type === 'alert' && <span className="text-yellow-400 font-bold">{msg.text}</span>}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Botón Música */}
      <div className="absolute bottom-32 right-6 z-50">
        <button onClick={() => setMusicActive(!musicActive)} className={`p-3 rounded-full border transition-all duration-300 ${musicActive ? 'bg-pink-500/20 border-pink-500 text-pink-400 animate-pulse' : 'bg-slate-800/50 border-slate-600 text-slate-500'}`}>
          <Music className="w-6 h-6" />
        </button>
      </div>

      {/* HUD Habilidades */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-end gap-2 md:gap-6 z-50 pb-4">
        <AbilityIcon k="C" icon={Shield} label="Escudo" active={true} onClick={handleShield} />
        <AbilityIcon k="Q" icon={Snowflake} label="Calma" active={true} onClick={handleCalm} />
        <AbilityIcon k="E" icon={Heart} label="Curar" active={hp < 100} onClick={handleHeal} ready={hp < 100} />
        <AbilityIcon k="X" icon={Zap} label="Ulti" active={ultReady} onClick={handleUlt} ready={ultReady} />
      </div>

      {/* Contenedor Central */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pb-32">
        
        {/* Header */}
        <div className="absolute top-6 left-0 right-0 flex justify-between items-start px-4 md:px-12 opacity-90">
          {/* ICONO DE RAZE CLICKEABLE */}
          <div 
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => setShowGallery(true)}
            title="Ver Galería"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.5)] border-2 border-orange-400 group-hover:scale-110 transition-transform duration-300 z-10 relative">
                <span className="font-bold text-[10px] text-white">RAZE</span> 
              </div>
              {/* Indicador de click */}
              <div className="absolute -right-1 -top-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border-2 border-slate-900 z-20"></div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-slate-400 uppercase group-hover:text-orange-400 transition-colors">Agente</span>
              <span className="text-sm font-bold text-white uppercase group-hover:text-orange-300 transition-colors">GUMYNOLA <ChevronRight className="inline w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/></span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-right">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[10px] text-slate-500 uppercase">Support</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">SAGE_JEAN_ONLINE</span>
            </div>
            <ShieldPlus className="w-6 h-6 text-emerald-400 animate-pulse-slow" />
          </div>
        </div>

        {/* Tarjeta Central (TEXTOS ORIGINALES) */}
        <div className={`max-w-md w-full bg-slate-800/50 backdrop-blur-lg rounded-2xl border p-8 text-center transition-all duration-300 
          ${shieldActive ? 'border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.5)] scale-105' : 'border-slate-700/50'}
          ${isHealed ? 'border-pink-300/50 shadow-[0_0_50px_rgba(244,114,182,0.2)]' : ''}
        `}>
          
          <div className="mb-8">
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Diagnóstico del Sistema</p>
            <h1 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 ${hp < 40 ? 'text-red-500' : hp < 100 ? 'text-yellow-500' : 'text-emerald-500'}`}>
              {isHealed ? "¡ENERGÍA RESTAURADA!" : "BATERÍA BAJA DETECTADA"}
            </h1>
            <p className="mt-4 text-slate-300 font-light leading-relaxed">
              {isHealed 
                ? "El sistema detecta niveles óptimos de ternura y fuerza. Tómate tu tiempo, Gumynola. No hay prisa para el ace."
                : "Parece que hoy el servidor de la vida real tiene un poco de lag y te sientes un poco 'low HP'."}
            </p>
          </div>

          {/* Barra HP */}
          <div className="relative w-full h-12 bg-slate-900/80 border-2 border-slate-600 rounded-sm mb-8 skew-x-[-10deg] overflow-hidden">
            <div className="absolute inset-0 z-20 flex items-center justify-center">
               <span className="font-bold text-xl shadow-black drop-shadow-md">{hp} / 100</span>
            </div>
            <div className={`h-full transition-all duration-500 ease-out ${getHealthColor()}`} style={{ width: `${hp}%` }}></div>
            <div className="absolute inset-0 z-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
          </div>

          {/* Botón Principal (E) */}
          {!isHealed ? (
            <button 
              ref={btnRef}
              onClick={handleHeal}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 mx-auto bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 rounded-full transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full group-hover:blur-2xl transition-all"></div>
              <span className="relative z-10 flex items-center gap-2 text-emerald-300 group-hover:text-emerald-200 font-medium tracking-wide uppercase">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Recibir Sanación (E)
              </span>
            </button>
          ) : (
            <div className="animate-fade-in-up">
              <div className="flex justify-center gap-4 mb-6">
                 <div className="p-3 bg-pink-500/20 rounded-full animate-bounce delay-100">
                   <Flower className="w-6 h-6 text-pink-300" />
                 </div>
                 <div className="p-3 bg-pink-500/20 rounded-full animate-bounce delay-200">
                   <Heart className="w-6 h-6 text-pink-300" />
                 </div>
                 <div className="p-3 bg-pink-500/20 rounded-full animate-bounce delay-300">
                   <Flower className="w-6 h-6 text-pink-300" />
                 </div>
              </div>
              <p className="text-pink-200 italic text-sm">
                "Hasta las main Raze necesitan recargar sus granadas a veces."
                <br/>
                Recupérate pronto. 🌸
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 20% { opacity: 0.8; } 100% { transform: translateY(-100px) rotate(20deg); opacity: 0; } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse 3s infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUpDisappear { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-30px); } }
        .animate-fade-up-disappear { animation: fadeUpDisappear 0.8s ease-out forwards; }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in-right { animation: fadeInRight 0.3s ease-out forwards; }
        @keyframes patrol { 0% { left: -10%; transform: scaleX(1); } 45% { left: 110%; transform: scaleX(1); } 50% { left: 110%; transform: scaleX(-1); } 95% { left: -10%; transform: scaleX(-1); } 100% { left: -10%; transform: scaleX(1); } }
        .animate-patrol { animation: patrol 20s linear infinite; }
        /* Custom scrollbar for gallery */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(249, 115, 22, 0.5); border-radius: 4px; }
      `}</style>
    </div>
  );
}
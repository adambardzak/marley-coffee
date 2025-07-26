'use client';

import { useState, useEffect } from 'react';
import FallingBeans from '../components/FallingBeans';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector('nav');
      if (isMenuOpen && nav && !nav.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Custom smooth scroll function with slower speed
  const smoothScrollTo = (elementId: string, duration: number = 1000) => {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop - 80; // offset for better positioning
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    // Easing function for smooth animation
    const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
  };

  const navItems = [
    { name: 'Domů', href: '#', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { name: 'Náš Příběh', href: '#about-section', onClick: () => smoothScrollTo('about-section') },
    { name: 'Kvalita', href: '#quality-section', onClick: () => smoothScrollTo('quality-section') },
    { name: 'Etika & Zdraví', href: '#ethics-section', onClick: () => smoothScrollTo('ethics-section') },
    { name: 'Životní Styl', href: '#lifestyle-section', onClick: () => smoothScrollTo('lifestyle-section') },
  ];

  return (
    <div className="bg-coffee-50 text-coffee-800">
      {/* Overlay pro ztmavení stránky při otevřeném menu */}
      <div className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`} onClick={() => setIsMenuOpen(false)} />
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrollY > 50 || isMenuOpen
          ? 'bg-coffee-900 shadow-2xl border-b border-coffee-800/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/marley-coffee-logo.png" 
                alt="Marley Coffee" 
                className={`h-12 sm:h-16 w-auto transition-all duration-300 ${
                  scrollY > 50 || isMenuOpen
                    ? 'brightness-[350%] contrast-100' 
                    : 'brightness-[400%] contrast-110 drop-shadow-lg'
                }`}
              />
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`relative text-coffee-100 hover:text-jamaican-gold transition-all duration-300 font-medium py-2 px-1 group ${
                    scrollY > 50 ? '' : 'drop-shadow-md'
                  }`}
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-jamaican-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <button className={`bg-jamaican-gold hover:bg-jamaican-gold/90 text-coffee-900 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                scrollY > 50 || isMenuOpen ? '' : 'shadow-lg'
              }`}>
                Koupit Kávu
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative text-coffee-100 hover:text-jamaican-gold p-3 rounded-xl transition-all duration-300 hover:bg-coffee-800/20 focus:outline-none"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <span 
                    className={`absolute left-0 top-1 w-6 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'rotate-45 top-2.5' : ''
                    }`}
                  />
                  <span 
                    className={`absolute left-0 top-2.5 w-6 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span 
                    className={`absolute left-0 top-4 w-6 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? '-rotate-45 top-2.5' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden absolute top-full left-0 w-full transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible -translate-y-4'
          }`}>
            <div className="bg-coffee-900 border-b border-coffee-800/30 shadow-2xl">
              <div className="px-4 py-6 space-y-1">
                {navItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-4 text-coffee-100 hover:text-jamaican-gold hover:bg-coffee-800/20 transition-all duration-300 rounded-xl font-medium border-l-4 border-transparent hover:border-jamaican-gold transform hover:translate-x-1 ${
                      isMenuOpen ? 'animate-slideInLeft' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {item.name}
                  </button>
                ))}
                <div className={`pt-4 border-t border-coffee-800/30 ${
                  isMenuOpen ? 'animate-slideInLeft' : ''
                }`}
                style={{
                  animationDelay: `${navItems.length * 50}ms`,
                  animationFillMode: 'both'
                }}>
                  <button className="w-full bg-gradient-to-r from-jamaican-gold to-jamaican-gold/80 hover:from-jamaican-gold/90 hover:to-jamaican-gold/70 text-coffee-900 px-6 py-4 rounded-xl font-semibold transition-all duration-300 text-center transform hover:scale-[1.02] hover:shadow-lg">
                    <span className="flex items-center justify-center gap-2">
                      Koupit Kávu
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/30717831/pexels-photo-30717831.jpeg" 
            alt="Coffee farmer in Jamaica mountains"
            className="w-full h-full object-cover object-center"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
            data-macaly="hero-background-image"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coffee-900/80 via-coffee-800/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="bebas-neue-regular text-4xl sm:text-5xl lg:text-7xl font-bold text-coffee-50 mb-1 leading-tight" data-macaly="hero-title">
              Marley Coffee
            </h1>
            <h2 className="bebas-neue-regular text-xl sm:text-2xl lg:text-3xl font-semibold text-jamaican-gold mb-6 leading-tight" data-macaly="hero-subtitle-heading">
              Káva, která Vás chytne za srdce.
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-coffee-100 mb-8 font-light leading-relaxed" data-macaly="hero-subtitle">
              Prémiová organická káva vytvářená se stejnou vášní, kterou Bob Marley vnášel do hudby. 
              Každý šálek v sobě nese rytmus Jamajky a slib etického obchodu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => smoothScrollTo('lifestyle-section', 1200)}
                className="bg-jamaican-gold hover:bg-jamaican-gold/90 text-coffee-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Objevte Naší Kávu
              </button>
              <button 
                onClick={() => smoothScrollTo('about-section', 1000)}
                className="border-2 border-coffee-100 text-coffee-100 hover:bg-coffee-100 hover:text-coffee-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300"
              >
                Náš Příběh
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-coffee-100 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
        <FallingBeans />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-1 gap-16 items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
              <h2 className="bebas-neue-regular text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-coffee-900 text-center" data-macaly="about-heading">
                Uctívání <span className="text-jamaican-gold">Odkazu</span>
              </h2>
              <div className="prose prose-lg text-coffee-700 space-y-6">
                <p data-macaly="about-description-1" className="text-center">
                  Založená Rohanem Marleyem, synem reggae legendy Boba Marleyho, naše káva ztělesňuje 
                  stejného revolučního ducha, který navždy změnil hudbu. Každé zrno je pečlivě vybíráno 
                  z Blue Mountains na Jamajce, kde dokonalé klima vytváří kávu nepřekonatelné kvality.
                </p>
                <blockquote className="border-l-4 border-jamaican-gold pl-6 italic text-xl text-coffee-800 font-light" data-macaly="about-quote">
                  "Stejně jako tatínkova hudba spojovala lidi, naše káva vytváří okamžiky 
                  spojení a vědomí v každém šálku."
                  <footer className="text-base font-normal mt-2 text-jamaican-gold">— Rohan Marley</footer>
                </blockquote>
                <p data-macaly="about-description-2" className="text-center">
                  Neprodáváme jen kávu - sdílíme kus jamajské kultury, podporujeme 
                  místní farmáře a pokračujeme v Bobově poselství jednoty, lásky a úcty k zemi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Quality Section */}
      <section id="quality-section" className="py-16 sm:py-20 lg:py-32 bg-coffee-900 text-coffee-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="bebas-neue-regular text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-center" data-macaly="quality-heading">
              Výjimečný <span className="text-jamaican-gold">Chuťový Profil</span>
            </h2>
            <p className="text-lg sm:text-xl text-coffee-100 max-w-3xl mx-auto leading-relaxed" data-macaly="quality-description">
              Naše zrna vyvíjejí složité chutě v mlhavých Blue Mountains a vytvářejí šálek, který je 
              tak bohatý a nuancovaný jako samotná Jamajka.
            </p>
          </div>
          
          <div className="space-y-12 sm:space-y-16">
            {/* Blueberry Notes - na mobilu text vždy nahoře */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-1">
                <div className="inline-block px-3 sm:px-4 py-2 bg-jamaican-gold/20 rounded-full text-jamaican-gold text-xs sm:text-sm font-semibold mb-4">
                  CHUŤOVÉ TÓNY
                </div>
                <h3 className="bebas-neue-regular text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-jamaican-gold" data-macaly="taste-blueberry-title">
                  Divoké Borůvky
                </h3>
                <p className="text-base sm:text-lg text-coffee-100 leading-relaxed mb-4 sm:mb-6" data-macaly="taste-blueberry-description">
                  Živé, ovocné tóny, které tančí na vašem patře, připomínající divoké jamajské bobule 
                  políbené horskou mlhou. Tyto zářivé chutě vycházejí z jedinečného terroir našich 
                  vysokohorských pěstebních oblastí.
                </p>
                <div className="text-coffee-200 italic text-sm sm:text-base">
                  "První doušek přináší vzpomínky na ranní procházky bobulkovými háji v Blue Mountains."
                </div>
              </div>
              <div className="order-2">
                <img 
                  src="https://images.pexels.com/photos/2008135/pexels-photo-2008135.jpeg" 
                  alt="Fresh blueberries with morning dew"
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl"
                  data-macaly="taste-blueberry-image"
                />
              </div>
            </div>

            {/* Cacao Notes - na mobilu text vždy nahoře */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-1 lg:order-2">
                <div className="inline-block px-3 sm:px-4 py-2 bg-jamaican-gold/20 rounded-full text-jamaican-gold text-xs sm:text-sm font-semibold mb-4">
                  ČOKOLÁDOVÉ PODTÓNY
                </div>
                <h3 className="bebas-neue-regular text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-jamaican-gold" data-macaly="taste-cacao-title">
                  Bohaté Kakao
                </h3>
                <p className="text-base sm:text-lg text-coffee-100 leading-relaxed mb-4 sm:mb-6" data-macaly="taste-cacao-description">
                  Hluboké, čokoládové podtóny, které poskytují teplo a pohodlí, jako objetí 
                  ostrovního slunce. Přírodní metody zpracování, které používáme, umožňují těmto chutím 
                  se plně rozvinout a vytvořit složitost v každém šálku.
                </p>
                <div className="text-coffee-200 italic text-sm sm:text-base">
                  "Základ čokolády, který kávu uzemnuje bohatostí a hloubkou."
                </div>
              </div>
              <div className="order-2 lg:order-1">
                <img 
                  src="https://images.pexels.com/photos/32597040/pexels-photo-32597040.jpeg" 
                  alt="Raw cacao beans showcasing chocolate heritage"
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl"
                  data-macaly="taste-cacao-image"
                />
              </div>
            </div>

            {/* Spice Notes - na mobilu text vždy nahoře */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-1">
                <div className="inline-block px-3 sm:px-4 py-2 bg-jamaican-gold/20 rounded-full text-jamaican-gold text-xs sm:text-sm font-semibold mb-4">
                  JAMAJSKÉ DĚDICTVÍ
                </div>
                <h3 className="bebas-neue-regular text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-jamaican-gold" data-macaly="taste-spices-title">
                  Ostrovní Koření
                </h3>
                <p className="text-base sm:text-lg text-coffee-100 leading-relaxed mb-4 sm:mb-6" data-macaly="taste-spices-description">
                  Jemné náznaky muškátového oříšku a nového koření, které vypráví příběh jamajského 
                  kořenného dědictví v každém doušku. Tyto delikátní tóny pocházejí z ostrovní sopečné půdy 
                  a tradičních farmářských metod předávaných po generace.
                </p>
                <div className="text-coffee-200 italic text-sm sm:text-base">
                  "Závěrečný dotek, který dělá každý šálek autenticky jamajským."
                </div>
              </div>
              <div className="order-2">
                <img 
                  src="https://images.pexels.com/photos/4589169/pexels-photo-4589169.jpeg" 
                  alt="Artisanal spices representing Jamaica's spice heritage"
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl"
                  data-macaly="taste-spices-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health & Ethics Section */}
      <section id="ethics-section" className="py-16 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div>
              <h2 className="bebas-neue-regular text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-coffee-900" data-macaly="ethics-heading">
                Čistá. <span className="text-jamaican-green">Organická.</span> <span className="text-jamaican-gold">Férová.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-jamaican-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg sm:text-xl mb-2 text-coffee-900" data-macaly="organic-title">100% Organicky Certifikovaná</h3>
                    <p className="text-coffee-700 text-sm sm:text-base" data-macaly="organic-description">
                      Pěstovaná bez syntetických pesticidů či chemikálií, chráníme vaše zdraví i nedotčený jamajský ekosystém.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-jamaican-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg sm:text-xl mb-2 text-coffee-900" data-macaly="fairtrade-title">Zaručený Férový Obchod</h3>
                    <p className="text-coffee-700 text-sm sm:text-base" data-macaly="fairtrade-description">
                      Každý nákup přímo podporuje jamajské farmářské rodiny a zajišťuje, že dostávají férové odměňování za svou výjimečnou práci.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-jamaican-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg sm:text-xl mb-2 text-coffee-900" data-macaly="sustainable-title">Udržitelné Zemědělství</h3>
                    <p className="text-coffee-700 text-sm sm:text-base" data-macaly="sustainable-description">
                      Tradiční stínové metody pěstování zachovávají biodiverzitu a zároveň produkují zrna s vynikající chutí a nižším dopadem na životní prostředí.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/30717831/pexels-photo-30717831.jpeg" 
                alt="Sustainable coffee farming in Jamaica"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-2xl"
                data-macaly="ethics-farming-image"
              />
              <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 bg-jamaican-gold text-coffee-900 p-4 sm:p-6 rounded-2xl shadow-xl">
                <div className="bebas-neue-regular text-2xl sm:text-3xl font-bold">1978</div>
                <div className="text-xs sm:text-sm">Farmářské Dědictví</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section id="lifestyle-section" className="py-16 sm:py-20 bg-gradient-to-br from-coffee-100 to-coffee-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="bebas-neue-regular text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-coffee-900" data-macaly="lifestyle-heading">
              Káva pro <span className="text-jamaican-gold">Vědomou Duši</span>
            </h2>
            <p className="text-lg sm:text-xl text-coffee-700 max-w-3xl mx-auto" data-macaly="lifestyle-description">
              Více než ranní rituál - je to moment všímavosti, spojení s přírodou 
              a oslava jednoduchých radostí života.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <img 
                src="/marley_01.png" 
                alt="Marley Coffee - káva s duší Jamajky"
                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl"
                data-macaly="lifestyle-brewing-image"
              />
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="bebas-neue-regular text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-coffee-900" data-macaly="slow-living-title">Pomalý Život, Bohatá Chuť</h3>
                <p className="text-coffee-700 leading-relaxed text-sm sm:text-base" data-macaly="slow-living-description">
                  Ve světě, který se pohybuje příliš rychle, vás Marley Coffee zve k pozastavení. Každý šálek je 
                  pozvánkou k nadechnutí, zamyšlení a opětovnému spojení s tím, na čem nejvíce záleží.
                </p>
              </div>
              
              <div>
                <h3 className="bebas-neue-regular text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-coffee-900" data-macaly="reggae-spirit-title">Reggae Duch, Kávové Srdce</h3>
                <p className="text-coffee-700 leading-relaxed text-sm sm:text-base" data-macaly="reggae-spirit-description">
                  Jako hudba, která proudí ze srdce Jamajky, naše káva nese rytmus, duši 
                  a sílu spojovat lidi kolem sdílených hodnot míru a jednoty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coffee-900 text-coffee-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 sm:mb-12">
            <div className="sm:col-span-2 md:col-span-2">
              <div className="bebas-neue-regular text-2xl sm:text-3xl font-bold text-jamaican-gold mb-4" data-macaly="footer-logo">
                Marley Coffee
              </div>
              <p className="text-coffee-200 mb-6 max-w-md text-sm sm:text-base" data-macaly="footer-description">
                Uctíváme odkaz Boba Marleyho prostřednictvím výjimečné kávy, která spojuje lidi 
                a zároveň podporuje jamajské komunity a udržitelné zemědělství.
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 bg-coffee-800 hover:bg-jamaican-gold rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">f</span>
                </button>
                <button className="w-10 h-10 bg-coffee-800 hover:bg-jamaican-gold rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">ig</span>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="bebas-neue-regular text-lg sm:text-xl font-bold mb-4 text-jamaican-gold" data-macaly="footer-coffee-title">Káva</h4>
              <ul className="space-y-2 text-coffee-200 text-sm sm:text-base">
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Blue Mountain Směs</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Organická Tmavá Pražka</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Reggae Rytmus Střední</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Předplatné</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="bebas-neue-regular text-lg sm:text-xl font-bold mb-4 text-jamaican-gold" data-macaly="footer-company-title">Společnost</h4>
              <ul className="space-y-2 text-coffee-200 text-sm sm:text-base">
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Náš Příběh</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Udržitelnost</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Farmáři</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Kontakt</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-coffee-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-coffee-300 text-xs sm:text-sm text-center md:text-left" data-macaly="footer-copyright">
              © 2025 Marley Coffee. Inspirováno odkazem Boba Marleyho jednoty a vědomí.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-xs sm:text-sm text-coffee-300">
              <a href="#" className="hover:text-jamaican-gold transition-colors">Zásady Ochrany Osobních Údajů</a>
              <a href="#" className="hover:text-jamaican-gold transition-colors">Podmínky Služby</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
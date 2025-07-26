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

  console.log("Marley Coffee page loaded, scroll position:", scrollY);

  return (
    <div className="bg-coffee-50 text-coffee-800">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-coffee-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/marley-coffee-logo.png" 
                alt="Marley Coffee" 
                className="h-16 w-auto brightness-[350%] contrast-100"
              />
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="text-coffee-100 hover:text-jamaican-gold transition-colors duration-200 font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <button className="bg-jamaican-gold hover:bg-jamaican-gold/90 text-coffee-900 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                Koupit Kávu
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-coffee-100 hover:text-jamaican-gold"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-coffee-900/95 backdrop-blur-md">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-coffee-100 hover:text-jamaican-gold transition-colors duration-200"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="px-3 py-2">
                  <button className="w-full bg-jamaican-gold hover:bg-jamaican-gold/90 text-coffee-900 px-6 py-3 rounded-full font-semibold transition-all duration-300">
                    Koupit Kávu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/30717831/pexels-photo-30717831.jpeg" 
            alt="Coffee farmer in Jamaica mountains"
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
            data-macaly="hero-background-image"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coffee-900/80 via-coffee-800/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-coffee-50 mb-2 leading-tight" data-macaly="hero-title">
              Marley Coffee
            </h1>
            <h2 className="font-playfair text-2xl lg:text-3xl font-semibold text-jamaican-gold mb-8 leading-tight" data-macaly="hero-subtitle-heading">
              Káva, která Vás chytne za srdce.
            </h2>
            <p className="text-xl lg:text-2xl text-coffee-100 mb-8 font-light leading-relaxed" data-macaly="hero-subtitle">
              Prémiová organická káva vytvářená se stejnou vášní, kterou Bob Marley vnášel do hudby. 
              Každý šálek v sobě nese rytmus Jamajky a slib etického obchodu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => smoothScrollTo('lifestyle-section', 1200)}
                className="bg-jamaican-gold hover:bg-jamaican-gold/90 text-coffee-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Objevte Naší Kávu
              </button>
              <button 
                onClick={() => smoothScrollTo('about-section', 1000)}
                className="border-2 border-coffee-100 text-coffee-100 hover:bg-coffee-100 hover:text-coffee-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
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
      <section id="about-section" className="relative py-20 lg:py-32 overflow-hidden">
        <FallingBeans />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-1 gap-16 items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
              <h2 className="font-playfair text-4xl lg:text-5xl font-bold mb-8 text-coffee-900 text-center" data-macaly="about-heading">
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
      <section id="quality-section" className="py-20 lg:py-32 bg-coffee-900 text-coffee-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold mb-6" data-macaly="quality-heading">
              Výjimečný <span className="text-jamaican-gold">Chuťový Profil</span>
            </h2>
            <p className="text-xl text-coffee-100 max-w-3xl mx-auto leading-relaxed" data-macaly="quality-description">
              Naše zrna vyvíjejí složité chutě v mlhavých Blue Mountains a vytvářejí šálek, který je 
              tak bohatý a nuancovaný jako samotná Jamajka.
            </p>
          </div>
          
          <div className="space-y-16">
            {/* Blueberry Notes - obrázek napravo */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="inline-block px-4 py-2 bg-jamaican-gold/20 rounded-full text-jamaican-gold text-sm font-semibold mb-4">
                  CHUŤOVÉ TÓNY
                </div>
                <h3 className="font-playfair text-3xl lg:text-4xl font-bold mb-6 text-jamaican-gold" data-macaly="taste-blueberry-title">
                  Divoké Borůvky
                </h3>
                <p className="text-lg text-coffee-100 leading-relaxed mb-6" data-macaly="taste-blueberry-description">
                  Živé, ovocné tóny, které tančí na vašem patře, připomínající divoké jamajské bobule 
                  políbené horskou mlhou. Tyto zářivé chutě vycházejí z jedinečného terroir našich 
                  vysokohorských pěstebních oblastí.
                </p>
                <div className="text-coffee-200 italic">
                  "První doušek přináší vzpomínky na ranní procházky bobulkovými háji v Blue Mountains."
                </div>
              </div>
              <div className="order-2">
                <img 
                  src="https://images.pexels.com/photos/2008135/pexels-photo-2008135.jpeg" 
                  alt="Fresh blueberries with morning dew"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                  data-macaly="taste-blueberry-image"
                />
              </div>
            </div>

            {/* Cacao Notes - obrázek nalevo (zůstává) */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <img 
                  src="https://images.pexels.com/photos/32597040/pexels-photo-32597040.jpeg" 
                  alt="Raw cacao beans showcasing chocolate heritage"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                  data-macaly="taste-cacao-image"
                />
              </div>
              <div className="order-2">
                <div className="inline-block px-4 py-2 bg-jamaican-gold/20 rounded-full text-jamaican-gold text-sm font-semibold mb-4">
                  ČOKOLÁDOVÉ PODTÓNY
                </div>
                <h3 className="font-playfair text-3xl lg:text-4xl font-bold mb-6 text-jamaican-gold" data-macaly="taste-cacao-title">
                  Bohaté Kakao
                </h3>
                <p className="text-lg text-coffee-100 leading-relaxed mb-6" data-macaly="taste-cacao-description">
                  Hluboké, čokoládové podtóny, které poskytují teplo a pohodlí, jako objetí 
                  ostrovního slunce. Přírodní metody zpracování, které používáme, umožňují těmto chutím 
                  se plně rozvinout a vytvořit složitost v každém šálku.
                </p>
                <div className="text-coffee-200 italic">
                  "Základ čokolády, který kávu uzemnuje bohatostí a hloubkou."
                </div>
              </div>
            </div>

            {/* Spice Notes - obrázek napravo */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="inline-block px-4 py-2 bg-jamaican-gold/20 rounded-full text-jamaican-gold text-sm font-semibold mb-4">
                  JAMAJSKÉ DĚDICTVÍ
                </div>
                <h3 className="font-playfair text-3xl lg:text-4xl font-bold mb-6 text-jamaican-gold" data-macaly="taste-spices-title">
                  Ostrovní Koření
                </h3>
                <p className="text-lg text-coffee-100 leading-relaxed mb-6" data-macaly="taste-spices-description">
                  Jemné náznaky muškátového oříšku a nového koření, které vypráví příběh jamajského 
                  kořenného dědictví v každém doušku. Tyto delikátní tóny pocházejí z ostrovní sopečné půdy 
                  a tradičních farmářských metod předávaných po generace.
                </p>
                <div className="text-coffee-200 italic">
                  "Závěrečný dotek, který dělá každý šálek autenticky jamajským."
                </div>
              </div>
              <div className="order-2">
                <img 
                  src="https://images.pexels.com/photos/4589169/pexels-photo-4589169.jpeg" 
                  alt="Artisanal spices representing Jamaica's spice heritage"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                  data-macaly="taste-spices-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health & Ethics Section */}
      <section id="ethics-section" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-playfair text-4xl lg:text-5xl font-bold mb-8 text-coffee-900" data-macaly="ethics-heading">
                Čistá. <span className="text-jamaican-green">Organická.</span> <span className="text-jamaican-gold">Férová.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-jamaican-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-coffee-900" data-macaly="organic-title">100% Organicky Certifikovaná</h3>
                    <p className="text-coffee-700" data-macaly="organic-description">
                      Pěstovaná bez syntetických pesticidů či chemikálií, chráníme vaše zdraví i nedotčený jamajský ekosystém.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-jamaican-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-coffee-900" data-macaly="fairtrade-title">Zaručený Férový Obchod</h3>
                    <p className="text-coffee-700" data-macaly="fairtrade-description">
                      Každý nákup přímo podporuje jamajské farmářské rodiny a zajišťuje, že dostávají férové odměňování za svou výjimečnou práci.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-jamaican-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-coffee-900" data-macaly="sustainable-title">Udržitelné Zemědělství</h3>
                    <p className="text-coffee-700" data-macaly="sustainable-description">
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
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                data-macaly="ethics-farming-image"
              />
              <div className="absolute -bottom-8 -right-8 bg-jamaican-gold text-coffee-900 p-6 rounded-2xl shadow-xl">
                <div className="font-playfair text-3xl font-bold">1978</div>
                <div className="text-sm">Farmářské Dědictví</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section id="lifestyle-section" className="py-20 bg-gradient-to-br from-coffee-100 to-coffee-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold mb-6 text-coffee-900" data-macaly="lifestyle-heading">
              Káva pro <span className="text-jamaican-gold">Vědomou Duši</span>
            </h2>
            <p className="text-xl text-coffee-700 max-w-3xl mx-auto" data-macaly="lifestyle-description">
              Více než ranní rituál - je to moment všímavosti, spojení s přírodou 
              a oslava jednoduchých radostí života.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/marley_01.png" 
                alt="Marley Coffee - káva s duší Jamajky"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                data-macaly="lifestyle-brewing-image"
              />
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="font-playfair text-2xl font-bold mb-4 text-coffee-900" data-macaly="slow-living-title">Pomalý Život, Bohatá Chuť</h3>
                <p className="text-coffee-700 leading-relaxed" data-macaly="slow-living-description">
                  Ve světě, který se pohybuje příliš rychle, vás Marley Coffee zve k pozastavení. Každý šálek je 
                  pozvánkou k nadechnutí, zamyšlení a opětovnému spojení s tím, na čem nejvíce záleží.
                </p>
              </div>
              
              <div>
                <h3 className="font-playfair text-2xl font-bold mb-4 text-coffee-900" data-macaly="reggae-spirit-title">Reggae Duch, Kávové Srdce</h3>
                <p className="text-coffee-700 leading-relaxed" data-macaly="reggae-spirit-description">
                  Jako hudba, která proudí ze srdce Jamajky, naše káva nese rytmus, duši 
                  a sílu spojovat lidi kolem sdílených hodnot míru a jednoty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coffee-900 text-coffee-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="font-playfair text-3xl font-bold text-jamaican-gold mb-4" data-macaly="footer-logo">
                Marley Coffee
              </div>
              <p className="text-coffee-200 mb-6 max-w-md" data-macaly="footer-description">
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
              <h4 className="font-playfair text-xl font-bold mb-4 text-jamaican-gold" data-macaly="footer-coffee-title">Káva</h4>
              <ul className="space-y-2 text-coffee-200">
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Blue Mountain Směs</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Organická Tmavá Pražka</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Reggae Rytmus Střední</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Předplatné</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-playfair text-xl font-bold mb-4 text-jamaican-gold" data-macaly="footer-company-title">Společnost</h4>
              <ul className="space-y-2 text-coffee-200">
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Náš Příběh</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Udržitelnost</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Farmáři</a></li>
                <li><a href="#" className="hover:text-jamaican-gold transition-colors">Kontakt</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-coffee-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-coffee-300 text-sm" data-macaly="footer-copyright">
              © 2025 Marley Coffee. Inspirováno odkazem Boba Marleyho jednoty a vědomí.
            </p>
            <div className="flex gap-6 text-sm text-coffee-300">
              <a href="#" className="hover:text-jamaican-gold transition-colors">Zásady Ochrany Osobních Údajů</a>
              <a href="#" className="hover:text-jamaican-gold transition-colors">Podmínky Služby</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
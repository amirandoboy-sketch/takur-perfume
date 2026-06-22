import { useState, useEffect, useRef } from 'react';

// Declaration to extend window object with YT (YouTube Player API)
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
    __ytCallbacks?: (() => void)[];
  }
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  notes: string;
  code: string;
  qty: number;
}

interface Product {
  id: string;
  name: string;
  code: string;
  badge: string;
  img: string;
  desc: string;
  notes: string;
  delay: string;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSentNames, setCheckoutSentNames] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // YouTube player states and player references
  const [videoReady, setVideoReady] = useState(false);
  const [scale, setScale] = useState(1);
  const playerRef = useRef<any>(null);
  const videoId = "N9RGckBgJQU";

  const addressPlayerRef = useRef<any>(null);
  const addressVideoId = "sBl9HBhz8vw";

  const comingSoonPlayerRef = useRef<any>(null);
  const comingSoonVideoId = "-Cd0sShuM4Y";

  // --- YouTube init ---
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const baseWidth = 1920;
      const baseHeight = 1080;
      const scaleX = width / baseWidth;
      const scaleY = height / baseHeight;
      setScale(Math.max(scaleX, scaleY));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    if (!window.__ytCallbacks) {
      window.__ytCallbacks = [];
    }

    const initPlayer = () => {
      const YT = window.YT;
      if (!YT) return;

      if (document.getElementById('takur-desktop-iframe') && !playerRef.current) {
        playerRef.current = new YT.Player('takur-desktop-iframe', {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            origin: window.location.origin,
            widget_referrer: window.location.href
          },
          events: {
            onReady: (event: any) => {
              event.target.mute();
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                setVideoReady(true);
              }
              if (event.data === 0) {
                event.target.seekTo(0);
                event.target.playVideo();
              }
            }
          }
        });
      }

      if (document.getElementById('address-youtube-iframe') && !addressPlayerRef.current) {
        addressPlayerRef.current = new YT.Player('address-youtube-iframe', {
          videoId: addressVideoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            origin: window.location.origin,
            widget_referrer: window.location.href
          },
          events: {
            onReady: (event: any) => {
              event.target.mute();
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === 0) {
                event.target.seekTo(0);
                event.target.playVideo();
              }
            }
          }
        });
      }

      if (document.getElementById('coming-soon-youtube-iframe') && !comingSoonPlayerRef.current) {
        comingSoonPlayerRef.current = new YT.Player('coming-soon-youtube-iframe', {
          videoId: comingSoonVideoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            origin: window.location.origin,
            widget_referrer: window.location.href
          },
          events: {
            onReady: (event: any) => {
              event.target.mute();
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === 0) {
                event.target.seekTo(0);
                event.target.playVideo();
              }
            }
          }
        });
      }
    };

    window.__ytCallbacks.push(initPlayer);
    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        if (window.__ytCallbacks) {
          window.__ytCallbacks.forEach(fn => fn());
          window.__ytCallbacks = [];
        }
      };
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (playerRef.current && playerRef.current.destroy) {
        try { playerRef.current.destroy(); } catch (e) {}
      }
      if (addressPlayerRef.current && addressPlayerRef.current.destroy) {
        try { addressPlayerRef.current.destroy(); } catch (e) {}
      }
      if (comingSoonPlayerRef.current && comingSoonPlayerRef.current.destroy) {
        try { comingSoonPlayerRef.current.destroy(); } catch (e) {}
      }
    };
  }, []);

  // --- Theme ---
  const [isLightTheme, setIsLightTheme] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'light';
    }
    return false;
  });

  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('viewMode') === 'mobile';
    }
    return false;
  });

  // --- Form States ---
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [msgInput, setMsgInput] = useState('');

  // --- Toast States ---
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Custom Cursor Elements ---
  const curRingRef = useRef<HTMLDivElement | null>(null);
  const curDotRef = useRef<HTMLDivElement | null>(null);
  const mouseGlowRef = useRef<HTMLDivElement | null>(null);

  // --- Apply dynamic body theme class ---
  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightTheme]);

  // --- Toast utilities ---
  const showToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMsg(message);
    setToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 4500);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const toggleTheme = () => {
    setIsLightTheme((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'light' : 'dark');
      showToast(next ? '☀️ Switched to Light theme!' : '🌙 Switched to Dark theme!');
      return next;
    });
  };

  // --- Cursor and Intersection Observer setup ---
  useEffect(() => {
    let rx = 0, ry = 0, mx = window.innerWidth / 2, my = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (curDotRef.current) {
        curDotRef.current.style.left = mx + 'px';
        curDotRef.current.style.top = my + 'px';
      }
      if (mouseGlowRef.current) {
        mouseGlowRef.current.style.left = mx + 'px';
        mouseGlowRef.current.style.top = my + 'px';
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    let animFrame: number;
    const animCursor = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (curRingRef.current) {
        curRingRef.current.style.left = rx + 'px';
        curRingRef.current.style.top = ry + 'px';
      }
      animFrame = requestAnimationFrame(animCursor);
    };
    animCursor();

    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animFrame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // --- Shopping Cart management ---
  const addToCart = (id: string, name: string, price: number, notes: string, code: string) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [...prevCart, { id, name, price, notes, code, qty: 1 }];
      }
    });
    showToast(`"${name}" added to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((i) => {
          if (i.id === id) {
            const nextQty = i.qty + delta;
            return { ...i, qty: nextQty };
          }
          return i;
        })
        .filter((i) => i.qty > 0)
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => setCheckoutSentNames(null), 400);
  };

  const checkout = () => {
    const orderDetails = cart.map(i => `• [${i.code}] ${i.name} (x${i.qty})`).join('\n');
    setMsgInput(`I would like to order:\n${orderDetails}\n\nPlease confirm availability and price.`);
    closeCart();
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
    showToast('Order items added to the contact form below!');
  };

  const sendMsg = () => {
    if (!nameInput.trim() || !phoneInput.trim()) {
      showToast('Please fill in your name and phone!');
      return;
    }
    const textMessage = `NEW MESSAGE / ORDER VIA TAKUR PERFUME\n👤 Name: ${nameInput.trim()}\n📞 Phone: ${phoneInput.trim()}\n\n💬 Message / Order Details:\n${msgInput.trim() || 'No additional details provided.'}`;
    window.open(`https://t.me/Legend_Takur?text=${encodeURIComponent(textMessage)}`, '_blank');
    showToast('Redirecting to Telegram to send message...');
    setNameInput('');
    setPhoneInput('');
    setMsgInput('');
  };

  const cartCount = cart.reduce((t, i) => t + i.qty, 0);

  return (
    <>
      {/* Custom Cursors */}
      <div id="mouse-glow" ref={mouseGlowRef}></div>
      <div id="cur-ring" ref={curRingRef}></div>
      <div id="cur-dot" ref={curDotRef}></div>

      {/* Modern Pop-up Toast notification */}
      <div id="toast" className={toastVisible ? 'show' : ''}>
        <span>✦</span>
        <span id="toast-msg">{toastMsg}</span>
        <button id="toast-dismiss" onClick={hideToast}>DISMISS</button>
      </div>

      {/* Floating Theme Toggle Switch */}
      <button 
        id="theme-toggle-btn" 
        onClick={toggleTheme} 
        title={isLightTheme ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {isLightTheme ? "🌙" : "☀️"}
      </button>

      <div id="app-wrapper" className={isMobileView ? 'force-mobile' : ''}>

        {/* ===== HEADER NAVIGATION ===== */}
        <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
          <div 
            className="nav-logo logo-text" 
            onClick={() => {
              const heroEl = document.getElementById('hero');
              if (heroEl) {
                heroEl.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span>TAKUR</span> PERFUME
          </div>
          <div className="nav-links">
            {['SHOP', 'COLLECTION', 'CONTACT', 'ADDRESS'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}-section`} className="nav-item">{item}</a>
            ))}
          </div>
          <div className="right-controls">
            <button className="nav-cart" onClick={openCart}>💼 CART ( {cartCount} )</button>
          </div>
        </nav>

        {/* ===== HERO COMPONENT ===== */}
        <section id="hero" style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: videoReady ? 1 : 0, transition: 'opacity 1s ease-in-out', overflow: 'hidden' }}>
            <div 
              id="takur-desktop-iframe" 
              style={{ position: 'absolute', top: '50%', left: '50%', width: '1920px', height: '1080px', transform: `translate(-50%, -50%) scale(${scale * 1.38}) translateZ(0)`, transformOrigin: 'center center', pointerEvents: 'none', willChange: 'transform' }} 
            />
          </div>
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'transparent', pointerEvents: 'auto' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(circle at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%), linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', color: '#ffffff', padding: '0 20px', pointerEvents: 'none' }}>
            <span className="hero-subtitle" style={{ letterSpacing: '6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>THE NEW STANDARD</span>
            <h1 className="hero-title" style={{ fontFamily: 'Georgia, serif', fontWeight: '400', margin: '0', letterSpacing: '1px' }}>Collection Nº 05</h1>
            
            <div className="perfume-wrapper">
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '110px', height: '150px', backgroundColor: 'transparent', animation: 'luxuryGoldGlow 4s ease-in-out infinite', willChange: 'transform, filter' }}>
                <div style={{ width: '26px', height: '4px', backgroundColor: '#d4af37', borderRadius: '3px 3px 0 0' }} />
                <div style={{ width: '22px', height: '24px', border: '1.5px solid #d4af37', borderTop: 'none', borderBottom: 'none', backgroundColor: '#000000' }} />
                <div style={{ width: '28px', height: '6px', border: '1.5px solid #d4af37', backgroundColor: '#000000', borderRadius: '2px' }} />
                <div style={{ width: '66px', height: '88px', border: '1.5px solid #d4af37', borderBottom: 'none', borderRadius: '26px 26px 0 0', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <div style={{ transform: 'rotate(-90deg)', fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#d4af37', letterSpacing: '5px', fontWeight: '700', whiteSpace: 'nowrap', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>TAKUR</div>
                </div>
                <div style={{ width: '72px', height: '8px', border: '1.5px solid #d4af37', borderRadius: '0 0 5px 5px', backgroundColor: '#000000' }} />
              </div>
            </div>

            <p className="hero-desc" style={{ lineHeight: '1.7', margin: '0 auto 36px auto', color: 'rgba(255,255,255,0.75)', fontWeight: '300', letterSpacing: '0.6px', maxWidth: '520px', fontSize: '0.92rem' }}>A quiet luxury movement. Uncompromising aesthetic engineering, captured in our latest signature scent.</p>
            
            <div style={{ display: 'flex', gap: '18px', pointerEvents: 'auto', justifyContent: 'center', alignItems: 'center' }}>
              <button 
                className="btn-primary" 
                style={{ backgroundColor: '#f5f5f7', color: '#000000', padding: '16px 36px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', borderRadius: '30px', border: 'none', cursor: 'pointer', transition: 'transform 0.2s ease, background-color 0.2s ease' }} 
                onClick={() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                SHOP NOW →
              </button>
              <button 
                className="btn-secondary" 
                style={{ backgroundColor: 'transparent', color: '#ffffff', padding: '16px 36px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease' }} 
                onClick={() => document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                VIEW DETAILS
              </button>
            </div>
          </div>

          <div className="scroll-indicator">
            <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize: '0.65rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 500 }}>SCROLL TO EXPLORE</span>
          </div>
        </section>

        {/* ===== SHOP SECTION ===== */}
        <section id="shop-section">
          <div className="shop-header reveal">
            <span className="section-tag">✦ SHOP</span>
            <h2 className="section-h2">Shop Our Fragrances</h2>
            <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.8, letterSpacing: '0.5px' }}>Original branded perfumes available now. All products are 100% authentic.</p>
          </div>
          <div className="shop-grid">
            <div className="shop-card reveal delay-1">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', width: '100%', height: '340px', position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#000' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
                  <img src="https://res.cloudinary.com/dmghgycec/image/upload/q_auto/f_auto/v1780943982/f72034bd-0190-4f33-9698-eda212d81a6c_u3qfrm.jpg" alt="Armani Tobacco You" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.08)', transformOrigin: 'center' }} referrerPolicy="no-referrer" />
                </div>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', background: 'linear-gradient(to bottom, transparent, #d4af37 15%, #ffebc2 50%, #d4af37 85%, transparent)', boxShadow: '0 0 12px rgba(212,175,55,0.8)', zIndex: 10, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
                  <img src="https://res.cloudinary.com/dmghgycec/image/upload/q_auto/f_auto/v1780944009/2597aeb2-9844-4e8f-a339-3d6846f84a72_ohbwyg.jpg" alt="Dior Sauvage Eau de Parfum" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.08)', transformOrigin: 'center' }} referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="shop-name">ARMANI TOBACCO YOU & DIOR SAUVAGE</div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto' }}>
                <button className="btn-add" onClick={() => addToCart('dual-1', 'ARMANI TOBACCO YOU & DIOR SAUVAGE', 0, 'Select items to confirm over Telegram', 'PREMIUM')}>ADD TO CART →</button>
              </div>
            </div>
            
            <div className="shop-card reveal delay-2">
              <div style={{ width: '100%', height: '340px', borderRadius: '12px', overflow: 'hidden', position: 'relative', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div 
                  id="coming-soon-youtube-iframe" 
                  style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', minWidth: '177.77%', transform: 'translate(-50%, -50%) scale(1.35)', transformOrigin: 'center center', pointerEvents: 'none' }} 
                />
                <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'transparent', pointerEvents: 'auto' }} />
                <div className="telegram-hero-pulse" style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 5, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: '#d4af37', borderRadius: '50%', color: '#0a0a0a' }}>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '44px', height: '44px', fill: '#0a0a0a', marginLeft: '-4px' }}>
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </div>
              </div>
              <div className="shop-name" style={{ color: 'rgba(255,255,255,0.4)' }}>MORE COMING SOON</div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto' }}>
                <button id="follow-telegram" className="btn-add" onClick={() => window.open('https://t.me/+0rOqQwD5kZAxZDI0', '_blank')}>FOLLOW ON TELEGRAM →</button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COLLECTION SECTION ===== */}
        <section id="collection-section">
          <div className="collection-header reveal">
            <div>
              <span className="section-tag">✦ COLLECTION</span>
              <h2 className="section-h2">Our Collection</h2>
            </div>
            <p className="collection-header-sub">Premium original fragrances. Each bottle is 100% authentic with full product details.</p>
          </div>
          <div className="product-grid">
            {[
              { id: 'c1', name: 'BOSS THE SCENT', code: 'HUGO BOSS', badge: 'EAU DE PARFUM', img: 'https://res.cloudinary.com/dmghgycec/image/upload/q_auto/f_auto/v1780943963/download_ss3a71.jpg', desc: 'Dark, seductive and masculine. The most iconic Hugo Boss fragrance for the modern man.', notes: 'Ginger, Leather | Cocoa, Vetiver', delay: 'delay-1' },
              { id: 'c2', name: 'BOSS BOTTLED UNLIMITED', code: 'HUGO BOSS', badge: 'EAU DE TOILETTE', img: 'https://res.cloudinary.com/dmghgycec/image/upload/q_auto/f_auto/v1780943943/2261c816-e9fe-415d-ae24-763565513ce7_lkj0za.jpg', desc: 'Fresh, sporty and clean. An everyday luxury scent that leaves a lasting impression.', notes: 'Grapefruit, Geranium | Sandalwood', delay: 'delay-2' },
              { id: 'c3', name: 'BLEU DE CHANEL', code: 'CHANEL', badge: 'EAU DE PARFUM', img: 'https://res.cloudinary.com/dmghgycec/image/upload/q_auto/f_auto/v1780944183/bleu_chanel_box_1780930715771_bvvivc.jpg', desc: 'An unexpected and undeniably bold masculine scent. Clean, deep, and intensely woody.', notes: 'Grapefruit, Mint, Incense, Ginger', delay: 'delay-3' }
            ].map((p: Product) => (
              <div className={`product-card reveal ${p.delay}`} key={p.id}>
                <div className="product-code-row">
                  <span className="product-code">{p.code}</span>
                  <span className="product-badge">{p.badge}</span>
                </div>
                <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', overflow: 'hidden' }}>
                  <img 
                    src={p.img} 
                    alt={p.name} 
                    referrerPolicy="no-referrer" 
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transform: p.id === 'c1' ? 'scale(1.4) translateY(-8px)' : p.id === 'c2' ? 'scale(1.4) translateY(-14px)' : 'none' }} 
                  />
                </div>
                <div className="product-name">{p.name}</div>
                <div className="product-desc">{p.desc}</div>
                <div className="product-footer">
                  <div>
                    <span className="product-price-label">PRICE</span>
                    <span className="product-price">DM US</span>
                  </div>
                  <div className="product-btns">
                    <button className="btn-add-sm" onClick={() => addToCart(p.id, p.name, 0, p.notes, p.code)}>ADD →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CONTACT SECTION ===== */}
        <section id="contact-section">
          <div className="contact-grid">
            <div className="reveal">
              <span className="section-tag">✦ CONTACT</span>
              <h2 className="section-h2">Get In Touch</h2>
              <p style={{ fontSize: '0.82rem', lineHeight: 2, color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>We are here to help you find the perfect fragrance. Reach out to us directly on any of these channels and we will get back to you quickly.</p>
              <div className="contact-channels">
                <div className="contact-channel">
                  <span className="channel-icon">📱</span>
                  <div>
                    <span className="channel-label">TELEGRAM</span>
                    <span className="channel-val">@Legend_Takur</span>
                  </div>
                </div>
                <div className="contact-channel">
                  <span className="channel-icon">📍</span>
                  <div>
                    <span className="channel-label">LOCATION</span>
                    <span className="channel-val">Welo Sefer, Garad Mall — Ground Floor</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form-box reveal delay-2">
              <div className="form-title">Send a Message</div>
              <div className="form-group">
                <label className="form-label">YOUR NAME</label>
                <input className="form-input" type="text" placeholder="Enter your name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">PHONE NUMBER</label>
                <input className="form-input" type="tel" placeholder="Your phone number" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">MESSAGE / ORDER</label>
                <textarea id="msg-input" className="form-textarea" placeholder="Which perfume do you want? Any questions?" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} />
              </div>
              <button className="btn-send" onClick={sendMsg}>SEND MESSAGE →</button>
            </div>
          </div>
        </section>

        {/* ===== ADDRESS SECTION ===== */}
        <section id="address-section">
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 1 }}>
            <div 
              id="address-youtube-iframe" 
              style={{ position: 'absolute', top: '50%', left: '50%', width: '130%', height: '130%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} 
            />
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none', background: 'radial-gradient(circle at 5% 5%, rgba(0,0,0,0.85) 0%, transparent 35%), radial-gradient(circle at 95% 95%, rgba(0,0,0,0.85) 0%, transparent 35%)' }} />
          <div className="address-overlay" />
          
          <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '30px' }}>
              <span className="section-tag">✦ ADDRESS</span>
              <h2 className="section-h2">Find Us</h2>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.9 }}>Visit our store in Addis Ababa. We are open every day and ready to help you find your perfect scent.</p>
            </div>
            
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5, pointerEvents: 'auto', cursor: 'pointer' }} onClick={() => window.open('https://maps.google.com/?q=Garad+Mall+Addis+Ababa', '_blank')}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', background: '#0a0a0a', borderRadius: '50%', border: '3px solid #d4af37', transition: 'transform 0.3s ease', animation: 'goldenBlackPulse 3.5s ease-in-out infinite', boxShadow: '0 0 30px rgba(212,175,55,0.3), 0 0 60px rgba(0,0,0,0.8)' }}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '56px', height: '56px', fill: '#d4af37' }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>
            
            <div className="address-grid">
              <div className="address-map-box reveal">
                <div className="address-map-inner">
                  <div className="map-icon">📍</div>
                  <div className="map-title">Takur Perfume</div>
                  <div className="map-sub">My Street · Garad Mall · Ground Floor<br />Addis Ababa, Ethiopia</div>
                  <button className="btn-map" onClick={() => window.open('https://maps.google.com/?q=Garad+Mall+Addis+Ababa', '_blank')}>OPEN IN GOOGLE MAPS →</button>
                </div>
              </div>
              <div className="address-details">
                <div className="address-card reveal">
                  <div className="address-card-icon">🏪</div>
                  <span className="address-card-label">STORE ADDRESS</span>
                  <div className="address-card-val">Welo Sefer<br />Garad Mall — Ground Floor<br />Addis Ababa, Ethiopia</div>
                </div>
                <div className="address-card reveal">
                  <div className="address-card-icon">📱</div>
                  <span className="address-card-label">CONTACT US</span>
                  <div className="address-card-val">Telegram: @Legend_Takur<br />DM us for orders and inquiries</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FOOTER COMPONENT ===== */}
        <footer>
          <div className="footer-copy">© 2026 Takur Perfume · All rights reserved.</div>
          <div className="footer-status">
            <div className="footer-status-dot"></div>
            <span className="footer-status-text">STORE OPEN · ADDIS ABABA</span>
          </div>
          <div className="footer-links"><a href="#contact-section">CONTACT</a></div>
        </footer>

        {/* ===== SHOPPING CART SIDEBAR DRAWER ===== */}
        <div id="cart-backdrop" className={isCartOpen ? 'open' : ''} onClick={closeCart} />
        <div id="cart-drawer" className={isCartOpen ? 'open' : ''}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="cart-header">
              <div className="cart-title">🛍 YOUR CART</div>
              <button className="cart-close" onClick={closeCart}>CLOSE [X]</button>
            </div>
            <div className="cart-items">
              {checkoutSentNames ? (
                <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>✅</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#10b981', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>ORDER RECEIVED</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(249,250,251,0.6)', lineHeight: 1.8, marginBottom: '16px' }}>
                    Thank you! Please contact us on Telegram <strong style={{ color: '#d4af37' }}>@Legend_Takur</strong> to confirm your order and arrange delivery.<br /><br />Order: {checkoutSentNames}
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-title">CART IS EMPTY</div>
                  <div className="cart-empty-text">Add perfumes from our shop or collection sections.</div>
                </div>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-header">
                      <div>
                        <span className="cart-item-code">{item.code}</span>
                        <div className="cart-item-name">{item.name}</div>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>🗑</button>
                    </div>
                    <div className="cart-item-notes">{item.notes}</div>
                    <div className="cart-item-footer">
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                        <span className="qty-val">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                      <span className="cart-item-price">{item.price > 0 ? `$${(item.price * item.qty).toFixed(2)}` : 'DM FOR PRICE'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="cart-footer">
            {checkoutSentNames ? (
              <button className="btn-done" onClick={closeCart}>CLOSE</button>
            ) : cart.length > 0 ? (
              <>
                <div className="cart-total-row">
                  <span>ITEMS IN CART</span>
                  <span>{cartCount}</span>
                </div>
                <div className="cart-total-row main">
                  <span>TO ORDER</span>
                  <span className="gold">DM @Legend_Takur</span>
                </div>
                <button className="btn-checkout" onClick={checkout}>SEND ORDER REQUEST →</button>
                <div className="cart-secure">CONTACT US ON TELEGRAM TO CONFIRM YOUR ORDER</div>
              </>
            ) : null}
          </div>
        </div>

      </div>
    </>
  );
}

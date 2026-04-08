import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSlideshow.css';

// Using local assets restored in previous turn
import slide1 from '../../assets/slide1.png';
import slide2 from '../../assets/slide2.png';
import slide3 from '../../assets/slide3.png';

const slides = [
  {
    image: slide1,
    title: "The Luxury Chess",
    subtitle: "Exquisite Staunton Collections",
    cta: "Shop Now",
    link: "/products"
  },
  {
    image: slide2,
    title: "Handcrafted Elegance",
    subtitle: "Timeless Masterpieces from India",
    cta: "Explore More",
    link: "/about"
  },
  {
    image: slide3,
    title: "Premium Materials",
    subtitle: "Finest Woods and Artisan Detail",
    cta: "View Collection",
    link: "/offers"
  }
];

const HeroSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slideshow">
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-overlay">
            <div className="slide-content">
              <span className="slide-badge">Exclusive Collection</span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <button 
                className="slide-btn"
                onClick={() => navigate(slide.link)}
              >
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="slide-indicators">
        {slides.map((_, i) => (
          <span 
            key={i} 
            className={`indicator ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow;

"use client"

import { useState, useEffect } from "react"
import "./Styles/Home.css"
import { Link } from "react-router-dom"
import Footer from "./footer"
const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [stats, setStats] = useState({
    songs: 0,
    artists: 0,
    users: 0,
    downloads: 0,
  })

  // אנימציה למספרים
  useEffect(() => {
    const targetStats = {
      songs: 50000,
      artists: 5000,
      users: 100000,
      downloads: 1000000,
    }

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        songs: Math.floor(targetStats.songs * progress),
        artists: Math.floor(targetStats.artists * progress),
        users: Math.floor(targetStats.users * progress),
        downloads: Math.floor(targetStats.downloads * progress),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setStats(targetStats)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  // רוטציה של פיצ'רים
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: "🎵",
      title: "ספריית שירים ענקית",
      description: "אלפי שירים מכל הז'אנרים והתקופות",
      color: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    },
    {
      icon: "🎧",
      title: "איכות צליל מושלמת",
      description: "חוויית האזנה באיכות HD ללא הפרעות",
      color: "linear-gradient(135deg, #06b6d4, #10b981)",
    },
    {
      icon: "🎤",
      title: "הקלטה מקצועית",
      description: "הקליטו את השירים שלכם באיכות סטודיו",
      color: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      icon: "📻",
      title: "קריוקי אינטראקטיבי",
      description: "שירו עם הטקסטים והמנגינות המקוריות",
      color: "linear-gradient(135deg, #f59e0b, #ef4444)",
    },
  ]

  const services = [
    { name: "שירים", icon: "🎵", count: "50K+", description: "שירים מכל הז'אנרים" },
    { name: "זמרים", icon: "👥", count: "5K+", description: "אמנים מהארץ והעולם" },
    { name: "הקלטה", icon: "🎤", count: "HD", description: "איכות אולפן מקצועי" },
    { name: "קריוקי", icon: "📻", count: "LIVE", description: "חוויה אינטראקטיבית" },
    { name: "רינגטונים", icon: "▶️", count: "∞", description: "רינגטונים מותאמים אישית" },
    { name: "בקשות", icon: "❤️", count: "24/7", description: "בקשו כל שיר שתרצו" },
  ]

  return (
    <div className="magical-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-sparkles">
            <span className="sparkle sparkle-1">✨</span>
            <span className="sparkle sparkle-2">✨</span>
            <span className="sparkle sparkle-3">✨</span>
          </div>

          <h1 className="hero-title">
            <span className="gradient-text">קסם של צלילים</span>
          </h1>

          <h2 className="hero-subtitle">אלפי שירים מחכים לכם, מה תרצו לשמוע?</h2>

          <p className="hero-description">
            גלו עולם של מוזיקה קסומה עם ספריית השירים הגדולה ביותר, כלי הקלטה מקצועיים וחוויית קריוקי בלתי נשכחת
          </p>

          <div className="hero-buttons">
            <Link to="/songs">
              <button className="cta-button primary">
                 התחילו לשמוע עכשיו ▶️
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{stats.songs.toLocaleString()}</div>
            <div className="stat-label">שירים</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.artists.toLocaleString()}</div>
            <div className="stat-label">אמנים</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.users.toLocaleString()}</div>
            <div className="stat-label">משתמשים</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.downloads.toLocaleString()}</div>
            <div className="stat-label">הורדות</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">
          <span className="gradient-text">מה מיוחד באתר שלנו?</span>
        </h2>

        <div className="features-showcase">
          <div className="feature-main">
            <div className="feature-card active" style={{ background: features[currentFeature].color }}>
              <div className="feature-icon">{features[currentFeature].icon}</div>
              <h3 className="feature-title">{features[currentFeature].title}</h3>
              <p className="feature-description">{features[currentFeature].description}</p>
            </div>
          </div>

          <div className="feature-indicators">
            {features.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentFeature ? "active" : ""}`}
                onClick={() => setCurrentFeature(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <h2 className="section-title">
          <span className="gradient-text">השירותים שלנו</span>
        </h2>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="service-icon">{service.icon}</div>
              <div className="service-content">
                <h3 className="service-name">{service.name}</h3>
                <div className="service-count">{service.count}</div>
                <p className="service-description">{service.description}</p>
              </div>
              <div className="service-glow"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            <span className="gradient-text">מוכנים להתחיל?</span>
          </h2>
          <p className="cta-description">הצטרפו למיליוני המשתמשים שכבר נהנים מהחוויה המוזיקלית הטובה ביותר</p>
          <Link to="/songs">
          <button className="cta-button-large">⭐ התחילו את המסע המוזיקלי ✨</button>
            </Link>
          
        </div>
      </section>
      <Footer />
    </div>
    
  )
}

export default Home

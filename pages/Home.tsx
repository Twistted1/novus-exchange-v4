import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import TrendingSection from "../components/TrendingSection";
import AboutSection from "../components/AboutSection";
import SolutionsSection from "../components/SolutionsSection";
import ArticlesSection from "../components/ArticlesSection";
import FooterSection from "../components/FooterSection";
import ChatWidget from "../components/ChatWidget";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "solutions", "articles"];
      const offsetHeight = 160;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offsetHeight && rect.bottom >= offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#06080C] text-white selection:bg-[#C92A35] selection:text-white">
      {/* Main navigation */}
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Hero section */}
      <HeroSection />

      {/* Real-time Tweak Metric & Ticker */}
      <TrendingSection />

      {/* About Section */}
      <AboutSection />

      {/* Tools & Solutions */}
      <SolutionsSection />

      {/* Declassified Articles Section */}
      <ArticlesSection />

      {/* Consolidated Footer */}
      <FooterSection />

      {/* Floating Intel Chat assistant widget */}
      <ChatWidget />
    </div>
  );
}

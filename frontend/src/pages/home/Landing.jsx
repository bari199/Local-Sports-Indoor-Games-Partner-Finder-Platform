import Navbar from "@/components/common/Navbar";
import GiftBanner from "@/components/common/GiftBanner";
import HeroSection from "@/components/landing/HeroSection";
import BookVenues from "@/components/landing/BookVenues";
import DiscoverGames from "@/components/landing/DiscoverGames";
import GiftStrip from "@/components/landing/GiftStrip";
import PopularSports from "@/components/landing/PopularSports";
import Spotlight from "@/components/landing/Spotlight";
import Blogs from "@/components/landing/Blogs";
import AboutTeam from "@/components/landing/AboutTeam";
import FAQ from "@/components/landing/FAQ";
import AppDownload from "@/components/landing/AppDownload";
import TopCities from "@/components/landing/TopCities";
import Footer from "@/components/common/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <GiftBanner />
      <HeroSection />
      <BookVenues />
      <DiscoverGames />
      <GiftStrip />
      <PopularSports />
      <Spotlight />
      <Blogs />
      <AboutTeam />
      <FAQ />
      <AppDownload />
      <TopCities />
      <Footer />
    </div>
  );
}
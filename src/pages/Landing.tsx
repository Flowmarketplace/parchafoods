import { lazy, Suspense } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingFooter from "@/components/landing/LandingFooter";

const LandingWhatIs = lazy(() => import("@/components/landing/LandingWhatIs"));
const LandingFeatures = lazy(() => import("@/components/landing/LandingFeatures"));
const LandingHowItWorks = lazy(() => import("@/components/landing/LandingHowItWorks"));
const LandingForBusiness = lazy(() => import("@/components/landing/LandingForBusiness"));
const LandingCTA = lazy(() => import("@/components/landing/LandingCTA"));

const LazySection = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="py-24" />}>{children}</Suspense>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <LandingHero />
      <LazySection><LandingWhatIs /></LazySection>
      <LazySection><LandingFeatures /></LazySection>
      <LazySection><LandingHowItWorks /></LazySection>
      <LazySection><LandingForBusiness /></LazySection>
      <LazySection><LandingCTA /></LazySection>
      <LandingFooter />
    </div>
  );
};

export default Landing;

import React from 'react';
import HeroCard from '@/app/components/home/HeroCard';
import InteractiveZone from '@/app/components/home/InteractiveZone';
import TutorVetting from '@/app/components/home/TutorVetting';
import SuccessMetrics from '@/app/components/home/SuccessMetrics';
import VirtualClassroom from '@/app/components/home/VirtualClassroom';
import HomeCTA from '@/app/components/home/HomeCTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <HeroCard />
      <InteractiveZone />
      <TutorVetting />
      <SuccessMetrics />
      <VirtualClassroom />
      <HomeCTA />
    </main>
  );
}
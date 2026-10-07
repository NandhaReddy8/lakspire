import { HeroSection } from '@/components/sections/HeroSection'
import { HowWeOperate } from '@/components/sections/HowWeOperate'
import { WhyLakspire } from '@/components/sections/WhyLakspire'
import { AIDataSolutions } from '@/components/sections/AIDataSolutions'
import { Industries } from '@/components/sections/Industries'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { TechHumanExpertise } from '@/components/sections/TechHumanExpertise'
import { FinalCTA } from '@/components/sections/FinalCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowWeOperate />
      <div className="optimize-paint op-size-why">
        <WhyLakspire />
      </div>
      <div className="optimize-paint op-size-ai">
        <AIDataSolutions />
      </div>
      <div className="optimize-paint op-size-industries">
        <Industries />
      </div>
      <div className="optimize-paint op-size-how">
        <HowWeWork />
      </div>
      <div className="optimize-paint op-size-tech">
        <TechHumanExpertise />
      </div>
      <div className="optimize-paint op-size-cta">
        <FinalCTA />
      </div>
    </>
  )
}

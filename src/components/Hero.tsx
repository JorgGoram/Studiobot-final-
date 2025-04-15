import { ElegantButton, HologramButton } from './buttons/ButtonEffects';

interface HeroProps {
  onStartCall: () => void;
  gridDistribution?: 'left' | 'center' | 'right';
}

export function Hero({ 
  onStartCall, 
  gridDistribution = 'center' 
}: HeroProps) {
  const getGridColumns = () => {
    switch (gridDistribution) {
      case 'left':
        return 'grid-cols-[3fr_1fr]';
      case 'right':
        return 'grid-cols-[1fr_3fr]';
      default:
        return 'grid-cols-[1.8fr_1fr]';
    }
  };

  return (
    <section className="min-h-screen flex items-center px-4 lg:px-35 relative overflow-hidden pt-16 sm:pt-16"> {/* Adjusted padding-top */}
      <div className="container mx-auto">

        {/* Desktop Layout */}
        <div className={`hidden lg:grid ${getGridColumns()} gap-18 items-center`}>
          
          {/* Left Column - Text */}
          <div className="lg:pr-12 lg:pl-10">
            <h1 className="text-6xl md:text-7xl font-montserrat font-black mb-6 leading-tight max-w-[800px]">
              <span className="gradient-text">AI VOICE AGENTS</span>{' '}
              TRAINED TO ASSIST THE TATTOO INDUSTRY
            </h1>

            <p className="text-hover text-xl mb-8">
              A single missed appointment per day can cost a tattoo studio up to{' '}
              <span className="gradient-text underline-animation">$70,000 in lost revenue</span>{' '}
              over a year. Our{' '}
              <span className="gradient-text underline-animation">AI voice agents</span> are trained for the tattoo industry, work 24/7 handling calls, appointments, 
              customer queries and reminders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <ElegantButton onClick={onStartCall}>Start Now →</ElegantButton>
              <HologramButton onClick={onStartCall}>Live Demo</HologramButton>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-[520px] aspect-[3/4] relative">
              <img 
                src="https://beige-select-ox-761.mypinata.cloud/ipfs/bafybeihisx7o37ak5zzxizopth6u4psctld6borakjtnry5sxyzemfbpve"
                alt="Professional tattoo machine"
                className="absolute inset-10 w-full h-full object-contain opacity-60 hover:opacity-80 transition-all duration-300 transform hover:scale-105"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden pt-24 md:pt-32">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-montserrat font-black mb-6 leading-tight">
            <span className="gradient-text">AI VOICE AGENTS</span><br />
            TRAINED TO ASSIST<br />
            THE TATTOO INDUSTRY
          </h1>

          <p className="text-hover text-xl mb-8">
            A single missed appointment per day can cost a tattoo studio up to{' '}
            <span className="gradient-text underline-animation">$70,000 in lost revenue</span>{' '}
            over a year.
          </p>

          <p className="text-hover text-lg sm:text-xl mb-8">
            Our{' '}
            <span className="gradient-text underline-animation">AI voice agents</span>, 
            trained for the tattoo industry, work 24/7 handling calls, appointments, 
            customer queries and reminders. You can focus on your art while our AI manages{' '}
            <span className="gradient-text underline-animation">communication tasks</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <ElegantButton onClick={onStartCall}>Start Now →</ElegantButton>
            <HologramButton onClick={onStartCall}>Live Demo</HologramButton>
          </div>
        </div>
      </div>
    </section>
  );
}

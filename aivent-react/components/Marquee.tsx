'use client'

const Marquee = () => {
  const marqueeItems = [
    'Next Intelligence',
    'Future Now',
    'Empowering Innovation',
    'Smarter Tomorrow',
    'Think Forward',
    'Cognitive Shift'
  ]

  return (
    <section className="py-8 bg-dark-700 border-y border-dark-600 overflow-hidden">
      <div className="relative">
        {/* First Marquee */}
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={`first-${index}`}
              className="text-2xl md:text-3xl font-bold text-gray-400 mx-8 flex items-center"
            >
              {item}
              <span className="mx-8 text-primary-500">/</span>
            </span>
          ))}
        </div>

        {/* Second Marquee (Reverse Direction) */}
        <div className="flex animate-marquee-reverse whitespace-nowrap mt-4" style={{ animationDirection: 'reverse' }}>
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={`second-${index}`}
              className="text-2xl md:text-3xl font-bold text-gray-400 mx-8 flex items-center"
            >
              {item}
              <span className="mx-8 text-primary-500">/</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        
        .animate-marquee-reverse {
          animation: marquee-reverse 25s linear infinite;
        }
      `}</style>
    </section>
  )
}

export default Marquee

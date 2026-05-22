import { Compass, BookOpen, Key, Layers, ShieldCheck, Feather } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto" id="about-canvas">
      
      {/* Introduction Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-brown-900 dark:text-white leading-tight">
          About Peach<span className="text-peach-555 animate-pulse">Mural</span>
        </h1>
        <p className="text-base sm:text-lg text-brown-650 dark:text-brown-300 max-w-2xl mx-auto leading-relaxed font-semibold">
          Blending Peach elements with woody earthen brown aesthetics to capture beautiful stories, instructions, travel murals, and culinary designs.
        </p>
      </section>

      {/* Philosophy Row banner with dynamic glow & hover */}
      <div className="relative rounded-2xl bg-gradient-to-br from-peach-100 to-peach-50 dark:from-brown-850 dark:to-brown-800 border border-peach-200 dark:border-brown-800 p-8 sm:p-10 text-brown-900 dark:text-white text-center space-y-4 neon-hover group cursor-pointer">
        <div className="mx-auto h-12 w-12 bg-white dark:bg-brown-900 text-peach-600 rounded-full flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-350">
          <Compass className="h-6 w-6 animate-logo-svg" />
        </div>
        <h2 className="font-display font-bold text-2xl group-hover:text-peach-600 transition-colors">The Concept</h2>
        <p className="text-sm sm:text-base text-brown-700 dark:text-brown-200 max-w-xl mx-auto leading-relaxed">
          PeachMural is a professional blogging arena built to merge aesthetic design and performance. Inspired by warm autumn peaches, soft sunsets, and woody soil, PeachMural provides custom writers in Coding, Travel, Cooking, Lifestyle, and Fashion with an safe space to share their masterpieces.
        </p>
      </div>

      {/* Feature grid */}
      <section className="space-y-6">
        <h3 className="font-display font-medium text-lg text-brown-500 dark:text-peach-250 uppercase tracking-widest text-center">
          Core Features & Architectures
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: JWT authorization */}
          <div className="bg-white dark:bg-brown-850 rounded-xl p-5 border border-peach-100 dark:border-brown-800 flex flex-col items-center text-center space-y-3 shadow-sm neon-hover group cursor-pointer">
            <span className="p-2.5 bg-peach-100 dark:bg-brown-900 text-peach-600 rounded-xl group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
              <Key className="h-5 w-5" />
            </span>
            <h4 className="font-bold text-base text-brown-850 dark:text-white">JWT Authorization</h4>
            <p className="text-xs text-brown-605 dark:text-brown-300 leading-relaxed">
              Safeguarded user profiles and write modules using modern JWT Auth protocols and bcrypt password encryption.
            </p>
          </div>

          {/* Card 2: Interactive Comment boxes */}
          <div className="bg-white dark:bg-brown-850 rounded-xl p-5 border border-peach-100 dark:border-brown-800 flex flex-col items-center text-center space-y-3 shadow-sm neon-hover group cursor-pointer">
            <span className="p-2.5 bg-peach-100 dark:bg-brown-900 text-peach-600 rounded-xl group-hover:scale-110 transition-all duration-300 -group-hover:rotate-6">
              <Layers className="h-5 w-5" />
            </span>
            <h4 className="font-bold text-base text-brown-850 dark:text-white">Rich Interactivity</h4>
            <p className="text-xs text-brown-605 dark:text-brown-300 leading-relaxed">
              Instantly toggle likes, publish deep comments, and manage discussions right on the summary card blocks.
            </p>
          </div>

          {/* Card 3: Cloudinary + drag and drop */}
          <div className="bg-white dark:bg-brown-850 rounded-xl p-5 border border-peach-100 dark:border-brown-800 flex flex-col items-center text-center space-y-3 shadow-sm neon-hover group cursor-pointer">
            <span className="p-2.5 bg-peach-100 dark:bg-brown-900 text-peach-600 rounded-xl group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h4 className="font-bold text-base text-brown-850 dark:text-white">Instant Uploads</h4>
            <p className="text-xs text-brown-605 dark:text-brown-300 leading-relaxed">
              Seamlessly drag, drop or drop images to convert to high-fidelity Base64 segments or connect to Cloudinary.
            </p>
          </div>

        </div>
      </section>

      {/* Developer Segment */}
      <section className="bg-white dark:bg-brown-850 rounded-2xl border border-peach-100 dark:border-brown-800 p-8 space-y-6 transition-colors duration-300 neon-hover group cursor-pointer md:p-10">
        <h3 className="font-display font-medium text-lg text-brown-500 dark:text-peach-250 uppercase tracking-widest text-center">
          The Engineering Team
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
          
          {/* Avatar with AH initials */}
          <div className="relative">
            <div className="h-24 w-24 bg-gradient-to-tr from-peach-400 via-peach-500 to-brown-500 rounded-full flex items-center justify-center text-white font-display font-extrabold text-2xl shadow-md border-4 border-white dark:border-brown-900 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,158,125,0.85)] group-hover:rotate-6">
              AH
            </div>
            <span className="absolute bottom-1 right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
          </div>

          {/* Text */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-display font-bold text-2xl text-brown-850 dark:text-white group-hover:text-peach-500 transition-colors">
                Aiza Hameed
              </h4>
              <p className="text-xs text-peach-600 dark:text-peach-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Feather className="h-3.5 w-3.5 text-peach-550 animate-bounce" />
                <span>Lead MERN Architect & Visual Designer</span>
              </p>
            </div>
            <p className="text-sm text-brown-655 dark:text-brown-300 max-w-sm leading-relaxed font-medium">
              Passionate full-stack developer focusing on crafting beautifully optimized Node, React and Express systems with elegant responsive aesthetics.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

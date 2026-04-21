import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, ChevronRight } from 'lucide-react';

export const Learning = () => {
   const resources = [
      {
         title: "Getting Started with ReviewMind",
         type: "Guide",
         icon: <FileText size={20} />,
         desc: "Learn how to upload your first CSV or scrape an Amazon URL for instant intelligence."
      },
      {
         title: "Understanding Brand Health Scores",
         type: "Article",
         icon: <BookOpen size={20} />,
         desc: "A deep dive into how Gemini 2.0 Flash calculates the overarching brand health metric."
      },
      {
         title: "The Emotion Breakdown",
         type: "Video",
         icon: <Video size={20} />,
         desc: "Understand how the matrix catches subtle Hindi and Hinglish emotional cues."
      }
   ];

   return (
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="max-w-7xl mx-auto px-6 py-12"
      >
         <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-white text-5xl font-extrabold tracking-tight mb-4">Learning Center</h1>
            <p className="text-brand-textSecondary text-xl">
               Master the power of AI-orchestrated analytics. Dive into our library of guides, tutorials, and documentation.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((res, i) => (
               <div key={i} className="apple-card p-8 group cursor-pointer border border-brand-border hover:border-brand-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        {res.icon}
                     </div>
                     <span className="text-xs font-black uppercase tracking-widest text-brand-textSecondary">{res.type}</span>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3 leading-tight">{res.title}</h3>
                  <p className="text-brand-textSecondary leading-relaxed">{res.desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-brand-primary font-bold text-sm group-hover:translate-x-2 transition-transform">
                     Start Learning <ChevronRight size={16} />
                  </div>
               </div>
            ))}
         </div>
      </motion.div>
   );
};

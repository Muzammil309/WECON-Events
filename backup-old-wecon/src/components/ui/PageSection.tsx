'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
export function PageSection({children,delay=0}:{children:ReactNode;delay?:number}){
  return (
    <motion.section initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-64px'}} transition={{duration:0.5,delay}} className="rounded-2xl p-6 sm:p-8 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.2)]">
      {children}
    </motion.section>
  );
}

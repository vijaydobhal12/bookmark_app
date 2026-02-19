'use client';

import { useEffect } from 'react';

// Dynamically import AOS to avoid SSR issues and compatibility problems
// with React 19 and Next.js 16 (Turbopack)
let AOS: any = null;

export const AOSInit = () => {
  useEffect(() => {
    const initAOS = async () => {
      if (!AOS) {
        const aosModule = await import('aos');
        AOS = aosModule.default;
        await import('aos/dist/aos.css');
      }
      
      if (AOS) {
        AOS.init({
          duration: 800,
          once: true,
        });
      }
    };

    initAOS();
  }, []);

  return null;
};

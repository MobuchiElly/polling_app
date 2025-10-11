"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {motion} from "framer-motion";

export function HeroSection() {
    return (
        <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
            <motion.div 
              className="absolute inset-0 z-0"
              initial={{ scale:1.2, opacity:0 }}
              animate={{ scale:1, opacity:0.3 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <Image
                    src="/hero-bg.webp"
                    alt="Hero Background"
                    fill
                    priority
                    quality={100}
                    style={{objectFit: "cover"}}
                />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[1]"/>
            <motion.div 
              className="relative z-10 px-4 md:px-8 max-w-3xl"
              initial={{ opacity:0, y:40 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, ease: "easeOut" }}
            >
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold leading-tight mb-4"
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}  
                  transition={{ delay:0.2, duration:0.8 }}
                >
                    Easily Create and Share Polls
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl mb-8 opacity-90"
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.2, duration:0.8 }}
                >
                    Quickly gather opinions and view real-time results with unique links and QR codes.
                </motion.p>
                <motion.div
                  initial={{ opacity:0, scale:0.9 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ delay:0.6, duration:0.6 }}
                >
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 text-lg px-8 py-3 rounded-md shadow-lg transition-all duration-300"
                    >
                        Create Your First Poll Now
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
}
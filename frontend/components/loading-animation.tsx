"use client"

import { motion } from "framer-motion"

export default function LoadingAnimation() {
  const containerVariants = {
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const dotVariants = {
    hidden: {
      y: "0%",
      scale: 0.5,
      opacity: 0,
    },
    visible: {
      y: "100%",
      scale: 1,
      opacity: 1,
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, zIndex: -1 }}
      className="fixed top-0 left-0 right-0 bottom-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        className="flex space-x-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[...Array(3)].map((_, index) => (
          <motion.span
            key={index}
            className="w-4 h-4 bg-black rounded-full"
            variants={dotVariants}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse" as const,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
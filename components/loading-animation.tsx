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
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50"
    >
      <motion.div
        className="flex space-x-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {[...Array(3)].map((_, index) => (
          <motion.span
            key={index}
            className="w-4 h-4 bg-blue-500 rounded-full"
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
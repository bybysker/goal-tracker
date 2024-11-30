import { motion } from 'framer-motion'

export function Mascot() {
  return (
    <motion.div
      className="relative w-40 h-40 mx-auto"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-lg opacity-75" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#3B82F6" />
          <circle cx="35" cy="40" r="5" fill="white" />
          <circle cx="65" cy="40" r="5" fill="white" />
          <path d="M35 60Q50 70 65 60" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </motion.div>
  )
}


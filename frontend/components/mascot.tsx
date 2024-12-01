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
        <div className="text-white text-9xl">🎯</div>
      </div>
    </motion.div>
  )
}


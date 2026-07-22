import { motion } from 'framer-motion';
import { CatSprite } from './CatSprite';

export function MergeAnimation({ level }: { level: number }) {
  return (
    <>
      <div className="absolute bottom-[14px] left-[55%] -translate-x-1/2">
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: [0, -15, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.5, times: [0, 0.4, 1], ease: 'easeInOut' }}
        >
          <CatSprite level={level} size={50} />
        </motion.div>
      </div>

      <div className="absolute bottom-[14px] left-[55%] -translate-x-1/2">
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: [0, 15, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.5, times: [0, 0.4, 1], ease: 'easeInOut' }}
        >
          <CatSprite level={level} size={50} />
        </motion.div>
      </div>

      <div className="absolute bottom-[14px] left-[55%] -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0, 1], scale: [0.3, 0.3, 1.1, 1] }}
          transition={{ duration: 0.5, times: [0, 0.4, 0.7, 1] }}
        >
          <CatSprite level={level + 1} size={50} />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-[14px] left-[55%] flex -translate-x-1/2 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0, 1, 0], scale: [0.5, 0.5, 1.8, 2.2] }}
          transition={{ duration: 0.5, times: [0, 0.4, 0.55, 1] }}
        >
          <span className="text-2xl">✨</span>
        </motion.div>
      </div>
    </>
  );
}

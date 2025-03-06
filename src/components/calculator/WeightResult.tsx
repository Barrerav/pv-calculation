
import React from 'react';
import { motion } from 'framer-motion';

interface WeightResultItemProps {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
  index: number;
}

const WeightResultItem = ({ label, value, unit, highlight = false, index }: WeightResultItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      className={`weight-result-item ${highlight ? 'border-asme-red bg-asme-red/10' : ''}`}
    >
      <span className="font-medium">{label}:</span>
      <span className={`font-mono ${highlight ? 'text-asme-red font-semibold' : 'text-asme-blue font-medium'}`}>
        {value} <span className="text-gray-500 text-sm">{unit}</span>
      </span>
    </motion.div>
  );
};

interface WeightResultProps {
  visible: boolean;
  results: {
    volumeShell: string;
    weightShell: string;
    volumeHeads: string;
    weightHeads: string;
    weightOpFluid: string;
    weightEmpty: string;
    weightOperation: string;
    weightTest: string;
  };
}

const WeightResult = ({ visible, results }: WeightResultProps) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="weight-result-box my-6"
    >
      <h3 className="text-xl font-medium text-asme-blue mb-4">Weight Results</h3>
      
      <div className="space-y-1">
        <WeightResultItem index={0} label="Shell Volume" value={results.volumeShell} unit="m³" />
        <WeightResultItem index={1} label="Shell Weight" value={results.weightShell} unit="kg" />
        <WeightResultItem index={2} label="Heads Volume" value={results.volumeHeads} unit="m³" />
        <WeightResultItem index={3} label="Heads Weight" value={results.weightHeads} unit="kg" />
        <WeightResultItem index={4} label="Operation Fluid Weight" value={results.weightOpFluid} unit="kg" />
        <WeightResultItem index={5} label="Total Empty Weight" value={results.weightEmpty} unit="kg" highlight={true} />
        <WeightResultItem index={6} label="Total Operation Weight" value={results.weightOperation} unit="kg" highlight={true} />
        <WeightResultItem index={7} label="Total Test Weight (water filled)" value={results.weightTest} unit="kg" highlight={true} />
      </div>
    </motion.div>
  );
};

export default WeightResult;

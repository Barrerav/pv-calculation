import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Calculator, HelpCircle, FileText } from 'lucide-react';
import SelectField from '@/components/calculator/SelectField';
import InputField from '@/components/calculator/InputField';
import Button from '@/components/calculator/Button';
import ResultBox from '@/components/calculator/ResultBox';
import ValueDisplay from '@/components/calculator/ValueDisplay';
import WeightResult from '@/components/calculator/WeightResult';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber, calculateRequiredShellThickness, calculateRequiredHeadsThickness, calculateMAWP_MAP, calculateWeights, type WeightResults } from '@/services/asme';
import { exportToPdf } from '@/services/pdfExporter';

// Options for heads type
const headsTypeOptions = [{
  value: 'select',
  label: 'Select...'
}, {
  value: 'hemispherical',
  label: 'Hemispherical'
}, {
  value: 'ellipsoidal',
  label: 'Ellipsoidal (2:1)'
}, {
  value: 'torispherical',
  label: 'Torispherical'
}];
const Index = () => {
  // States for main form fields
  const [headsType, setHeadsType] = useState('select');
  const [pressure, setPressure] = useState('');
  const [diameter, setDiameter] = useState('');
  const [stressValue, setStressValue] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [corrosionAllowance, setCorrosionAllowance] = useState('');

  // States for thickness results
  const [showThicknessResults, setShowThicknessResults] = useState(false);
  const [reqShellThk, setReqShellThk] = useState('0.00');
  const [reqHeadsThk, setReqHeadsThk] = useState('0.00');

  // States for second form
  const [showNominalForm, setShowNominalForm] = useState(false);
  const [shellNominalThk, setShellNominalThk] = useState('');
  const [headsNominalThk, setHeadsNominalThk] = useState('');
  const [cylinderHeight, setCylinderHeight] = useState('');
  const [materialDensity, setMaterialDensity] = useState('7850');
  const [operationFluidHeight, setOperationFluidHeight] = useState('');
  const [operationFluidDensity, setOperationFluidDensity] = useState('1000');

  // States for MAWP/MAP results
  const [showMawpResults, setShowMawpResults] = useState(false);
  const [mawpValue, setMawpValue] = useState('0.00');
  const [mapValue, setMapValue] = useState('0.00');

  // States for weight results
  const [showWeightResults, setShowWeightResults] = useState(false);
  const [weightResults, setWeightResults] = useState<{
    volumeShell: string;
    weightShell: string;
    volumeHeads: string;
    weightHeads: string;
    weightOpFluid: string;
    weightEmpty: string;
    weightOperation: string;
    weightTest: string;
  }>({
    volumeShell: '0.00',
    weightShell: '0.00',
    volumeHeads: '0.00',
    weightHeads: '0.00',
    weightOpFluid: '0.00',
    weightEmpty: '0.00',
    weightOperation: '0.00',
    weightTest: '0.00'
  });

  // Functions to calculate thicknesses
  const handleCalculateThickness = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pBarg = parseFloat(pressure);
      const P = pBarg * 0.1; // Convert barg to MPa
      const D = parseFloat(diameter);
      const S = parseFloat(stressValue);
      const E = parseFloat(efficiency);
      const CA = parseFloat(corrosionAllowance);

      // Calculations
      const reqShell = calculateRequiredShellThickness(P, D, S, E, CA);
      const reqHeads = calculateRequiredHeadsThickness(headsType, P, D, S, E, CA);

      // Update states
      setReqShellThk(formatNumber(reqShell));
      setReqHeadsThk(formatNumber(reqHeads));
      setShowThicknessResults(true);
      setShowNominalForm(true);

      // Suggested values for nominal thicknesses
      setShellNominalThk(Math.ceil(reqShell).toString());
      setHeadsNominalThk(Math.ceil(reqHeads).toString());
      toast.success('Calculation completed successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error in calculation. Please check your input data.');
    }
  };

  // Calculate MAWP/MAP
  const handleCalculateMAWP = () => {
    try {
      if (!shellNominalThk || !headsNominalThk) {
        toast.error('Please enter nominal thicknesses');
        return;
      }
      const shellNomThk = parseFloat(shellNominalThk);
      const headsNomThk = parseFloat(headsNominalThk);
      const D = parseFloat(diameter);
      const S = parseFloat(stressValue);
      const E = parseFloat(efficiency);
      const CA = parseFloat(corrosionAllowance);
      if (shellNomThk <= 0 || headsNomThk <= 0) {
        toast.error('Nominal thicknesses must be greater than zero');
        return;
      }
      const {
        MAWP,
        MAP
      } = calculateMAWP_MAP(shellNomThk, headsNomThk, headsType, D, S, E, CA);
      setMawpValue(formatNumber(MAWP));
      setMapValue(formatNumber(MAP));
      setShowMawpResults(true);
      toast.success('MAWP/MAP calculated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error in MAWP/MAP calculation');
    }
  };

  // Calculate weights
  const handleCalculateWeights = () => {
    try {
      if (!shellNominalThk || !headsNominalThk || !cylinderHeight || !operationFluidHeight) {
        toast.error('Please complete all required fields');
        return;
      }
      const shellNomThk = parseFloat(shellNominalThk);
      const headsNomThk = parseFloat(headsNominalThk);
      const D = parseFloat(diameter);
      const cylHeight = parseFloat(cylinderHeight);
      const matDensity = parseFloat(materialDensity);
      const opFluidHeight = parseFloat(operationFluidHeight);
      const opFluidDens = parseFloat(operationFluidDensity);
      if (shellNomThk <= 0 || headsNomThk <= 0) {
        toast.error('Nominal thicknesses must be greater than zero');
        return;
      }
      const results = calculateWeights(shellNomThk, headsNomThk, headsType, D, cylHeight, matDensity, opFluidHeight, opFluidDens);
      setWeightResults({
        volumeShell: formatNumber(results.volumeShell),
        weightShell: formatNumber(results.weightShell),
        volumeHeads: formatNumber(results.volumeHeads),
        weightHeads: formatNumber(results.weightHeads),
        weightOpFluid: formatNumber(results.weightOpFluid),
        weightEmpty: formatNumber(results.weightEmpty),
        weightOperation: formatNumber(results.weightOperation),
        weightTest: formatNumber(results.weightTest)
      });
      setShowWeightResults(true);
      toast.success('Weights calculated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error in weight calculation');
    }
  };

  // Generate PDF report
  const handleGeneratePdf = () => {
    try {
      exportToPdf({
        headsType,
        pressure,
        diameter,
        stressValue,
        efficiency,
        corrosionAllowance,
        reqShellThk,
        reqHeadsThk,
        shellNominalThk,
        headsNominalThk,
        cylinderHeight,
        materialDensity,
        operationFluidHeight,
        operationFluidDensity,
        mawpValue,
        mapValue,
        weightResults
      });
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error generating PDF report');
    }
  };

  // Reset all
  const handleReset = () => {
    setHeadsType('select');
    setPressure('');
    setDiameter('');
    setStressValue('');
    setEfficiency('');
    setCorrosionAllowance('');
    setShellNominalThk('');
    setHeadsNominalThk('');
    setCylinderHeight('');
    setMaterialDensity('7850');
    setOperationFluidHeight('');
    setOperationFluidDensity('1000');
    setShowThicknessResults(false);
    setShowNominalForm(false);
    setShowMawpResults(false);
    setShowWeightResults(false);
    toast.info('Form reset');
  };

  // For showing tooltips with information
  const InfoTooltip = ({
    text
  }: {
    text: string;
  }) => <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-asme-teal opacity-70 cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent className="bg-white p-3 shadow-lg border border-asme-teal/20 max-w-xs">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
  return <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef3f7] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="glassmorphism p-8 mb-8 overflow-hidden">
          <div className="flex items-center justify-center mb-6">
            <Calculator className="w-9 h-9 text-asme-teal mr-3" />
            <motion.div initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.3,
            duration: 0.5
          }}>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-asme-blue to-asme-teal">
                ASME Sec. VIII Div.1 Calculator
              </h1>
              <p className="text-asme-green text-xs font-extralight">
                By Vicente Barrera
              </p>
            </motion.div>
          </div>

          {/* === MAIN FORM === */}
          <form onSubmit={handleCalculateThickness} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SelectField id="headsType" label="Heads Type" value={headsType} onChange={setHeadsType} options={headsTypeOptions} required />
                
                <InputField id="pressure" label="Design Pressure (P)" value={pressure} onChange={e => setPressure(e.target.value)} placeholder="Ex: 10" required unit="barg" />
                
                <InputField id="diameter" label="Internal Diameter (D)" value={diameter} onChange={e => setDiameter(e.target.value)} placeholder="Ex: 1000" required unit="mm" />
              </div>
              
              <div>
                <InputField id="stressValue" label={<div className="flex items-center">
                      Stress Value (S)
                      <InfoTooltip text="Material stress value according to ASME Sec II D" />
                    </div>} value={stressValue} onChange={e => setStressValue(e.target.value)} placeholder="Ex: 137.9" required unit="MPa" />
                
                <InputField id="efficiency" label={<div className="flex items-center">
                      Joint Efficiency (E)
                      <InfoTooltip text="Joint efficiency factor, 0.7 to 1.0" />
                    </div>} value={efficiency} onChange={e => setEfficiency(e.target.value)} placeholder="Ex: 0.85" min={0} max={1} required />
                
                <InputField id="corrosionAllowance" label="Corrosion Allowance" value={corrosionAllowance} onChange={e => setCorrosionAllowance(e.target.value)} placeholder="Ex: 3" min={0} required unit="mm" />
              </div>
            </div>
            
            <Button type="submit" className="mt-6">
              Calculate Required Thicknesses
            </Button>
          </form>

          {/* === THICKNESS RESULTS === */}
          <ResultBox visible={showThicknessResults} title="Required Thicknesses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValueDisplay label="Shell Required Thickness" value={`${reqShellThk} mm`} highlight={true} delay={0.1} />
              <ValueDisplay label="Heads Required Thickness" value={`${reqHeadsThk} mm`} highlight={true} delay={0.2} />
            </div>
          </ResultBox>

          {/* === FORM WITH NOMINAL THICKNESSES === */}
          {showNominalForm && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} transition={{
          duration: 0.5
        }} className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-asme-blue mb-4">
                Nominal Thicknesses and Weight Calculation
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputField id="shellNominalThk" label="Shell Nominal Thickness (incl. corrosion)" value={shellNominalThk} onChange={e => setShellNominalThk(e.target.value)} placeholder="Ex: 10" required unit="mm" />
                  
                  <InputField id="headsNominalThk" label="Heads Nominal Thickness (incl. corrosion)" value={headsNominalThk} onChange={e => setHeadsNominalThk(e.target.value)} placeholder="Ex: 12" required unit="mm" />
                  
                  <InputField id="cylinderHeight" label="Cylinder Height" value={cylinderHeight} onChange={e => setCylinderHeight(e.target.value)} placeholder="Ex: 3000" required unit="mm" />
                </div>
                
                <div>
                  <InputField id="materialDensity" label="Material Density" value={materialDensity} onChange={e => setMaterialDensity(e.target.value)} placeholder="Ex: 7850" required unit="kg/m³" />
                  
                  <InputField id="operationFluidHeight" label="Operation Fluid Height" value={operationFluidHeight} onChange={e => setOperationFluidHeight(e.target.value)} placeholder="Ex: 2500" required unit="mm" />
                  
                  <InputField id="operationFluidDensity" label="Operation Fluid Density" value={operationFluidDensity} onChange={e => setOperationFluidDensity(e.target.value)} placeholder="Ex: 1000" required unit="kg/m³" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <Button onClick={handleCalculateMAWP}>
                  Calculate MAWP / MAP
                </Button>
                <Button onClick={handleCalculateWeights}>
                  Calculate Weights
                </Button>
              </div>
            </motion.div>}

          {/* === MAWP RESULTS === */}
          <ResultBox visible={showMawpResults}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValueDisplay label="MAWP" value={`${mawpValue} barg`} highlight={true} delay={0.1} />
              <ValueDisplay label="MAP" value={`${mapValue} barg`} delay={0.2} />
            </div>
          </ResultBox>

          {/* === WEIGHT RESULTS === */}
          <WeightResult visible={showWeightResults} results={weightResults} />

          {/* === RESET AND PDF BUTTONS === */}
          {(showThicknessResults || showNominalForm) && <div className="mt-6 flex gap-4 justify-between">
              <Button onClick={handleReset} variant="danger">
                Reset
              </Button>
              
              <Button onClick={handleGeneratePdf} variant="secondary" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Export PDF Report
              </Button>
            </div>}
        </motion.div>
      </div>
    </div>;
};
export default Index;
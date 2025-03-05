
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Calculator, HelpCircle } from 'lucide-react';

import SelectField from '@/components/calculator/SelectField';
import InputField from '@/components/calculator/InputField';
import Button from '@/components/calculator/Button';
import ResultBox from '@/components/calculator/ResultBox';
import ValueDisplay from '@/components/calculator/ValueDisplay';
import WeightResult from '@/components/calculator/WeightResult';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import {
  formatNumber,
  calculateRequiredShellThickness,
  calculateRequiredHeadsThickness,
  calculateMAWP_MAP,
  calculateWeights,
  type WeightResults
} from '@/services/asmeCalculator';

// Opciones para el tipo de cabezas
const headsTypeOptions = [
  { value: '', label: 'Seleccione...' },
  { value: 'hemispherical', label: 'Hemispherical' },
  { value: 'ellipsoidal', label: 'Ellipsoidal (2:1)' },
  { value: 'torispherical', label: 'Torispherical' }
];

const Index = () => {
  // Estados para los campos del formulario principal
  const [headsType, setHeadsType] = useState('');
  const [pressure, setPressure] = useState('');
  const [diameter, setDiameter] = useState('');
  const [stressValue, setStressValue] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [corrosionAllowance, setCorrosionAllowance] = useState('');

  // Estados para resultados de espesor
  const [showThicknessResults, setShowThicknessResults] = useState(false);
  const [reqShellThk, setReqShellThk] = useState('0,00');
  const [reqHeadsThk, setReqHeadsThk] = useState('0,00');

  // Estados para segundo formulario
  const [showNominalForm, setShowNominalForm] = useState(false);
  const [shellNominalThk, setShellNominalThk] = useState('');
  const [headsNominalThk, setHeadsNominalThk] = useState('');
  const [cylinderHeight, setCylinderHeight] = useState('');
  const [materialDensity, setMaterialDensity] = useState('7850');
  const [operationFluidHeight, setOperationFluidHeight] = useState('');
  const [operationFluidDensity, setOperationFluidDensity] = useState('1000');

  // Estados para resultados MAWP/MAP
  const [showMawpResults, setShowMawpResults] = useState(false);
  const [mawpValue, setMawpValue] = useState('0,00');
  const [mapValue, setMapValue] = useState('0,00');

  // Estados para resultados de peso
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
    volumeShell: '0,00',
    weightShell: '0,00',
    volumeHeads: '0,00',
    weightHeads: '0,00',
    weightOpFluid: '0,00',
    weightEmpty: '0,00',
    weightOperation: '0,00',
    weightTest: '0,00'
  });

  // Funciones para calcular espesores
  const handleCalculateThickness = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const pBarg = parseFloat(pressure);
      const P = pBarg * 0.1; // Convertir barg a MPa
      const D = parseFloat(diameter);
      const S = parseFloat(stressValue);
      const E = parseFloat(efficiency);
      const CA = parseFloat(corrosionAllowance);

      // Cálculos
      const reqShell = calculateRequiredShellThickness(P, D, S, E, CA);
      const reqHeads = calculateRequiredHeadsThickness(headsType, P, D, S, E, CA);

      // Actualizamos estados
      setReqShellThk(formatNumber(reqShell));
      setReqHeadsThk(formatNumber(reqHeads));
      setShowThicknessResults(true);
      setShowNominalForm(true);

      // Valores sugeridos para los espesores nominales
      setShellNominalThk(Math.ceil(reqShell).toString());
      setHeadsNominalThk(Math.ceil(reqHeads).toString());

      toast.success('Cálculo completado con éxito');
    } catch (error) {
      console.error(error);
      toast.error('Error en el cálculo. Revise los datos ingresados.');
    }
  };

  // Calcular MAWP/MAP
  const handleCalculateMAWP = () => {
    try {
      if (!shellNominalThk || !headsNominalThk) {
        toast.error('Ingrese los espesores nominales');
        return;
      }

      const shellNomThk = parseFloat(shellNominalThk);
      const headsNomThk = parseFloat(headsNominalThk);
      const D = parseFloat(diameter);
      const S = parseFloat(stressValue);
      const E = parseFloat(efficiency);
      const CA = parseFloat(corrosionAllowance);

      if (shellNomThk <= 0 || headsNomThk <= 0) {
        toast.error('Los espesores nominales deben ser mayores a cero');
        return;
      }

      const { MAWP, MAP } = calculateMAWP_MAP(shellNomThk, headsNomThk, headsType, D, S, E, CA);

      setMawpValue(formatNumber(MAWP));
      setMapValue(formatNumber(MAP));
      setShowMawpResults(true);
      
      toast.success('MAWP/MAP calculado con éxito');
    } catch (error) {
      console.error(error);
      toast.error('Error en el cálculo de MAWP/MAP');
    }
  };

  // Calcular pesos
  const handleCalculateWeights = () => {
    try {
      if (!shellNominalThk || !headsNominalThk || !cylinderHeight || !operationFluidHeight) {
        toast.error('Complete todos los campos requeridos');
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
        toast.error('Los espesores nominales deben ser mayores a cero');
        return;
      }

      const results = calculateWeights(
        shellNomThk,
        headsNomThk,
        headsType,
        D,
        cylHeight,
        matDensity,
        opFluidHeight,
        opFluidDens
      );

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
      toast.success('Pesos calculados con éxito');
    } catch (error) {
      console.error(error);
      toast.error('Error en el cálculo de pesos');
    }
  };

  // Reset all
  const handleReset = () => {
    setHeadsType('');
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
    
    toast.info('Formulario reiniciado');
  };

  // Para mostrar tooltips con información
  const InfoTooltip = ({ text }: { text: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-asme-teal opacity-70 cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent className="bg-white p-3 shadow-lg border border-asme-teal/20 max-w-xs">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef3f7] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glassmorphism p-8 mb-8 overflow-hidden"
        >
          <div className="flex items-center justify-center mb-6">
            <Calculator className="w-9 h-9 text-asme-teal mr-3" />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-asme-blue to-asme-teal">
                Calculadora ASME Sec. VIII Div.1
              </h1>
              <p className="text-asme-green text-sm font-medium">
                Por Vicente Barrera
              </p>
            </motion.div>
          </div>

          {/* === FORMULARIO PRINCIPAL === */}
          <form onSubmit={handleCalculateThickness} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SelectField
                  id="headsType"
                  label="Heads Type"
                  value={headsType}
                  onChange={setHeadsType}
                  options={headsTypeOptions}
                  required
                />
                
                <InputField
                  id="pressure"
                  label="Design Pressure (P)"
                  value={pressure}
                  onChange={(e) => setPressure(e.target.value)}
                  placeholder="Ej: 10"
                  required
                  unit="barg"
                />
                
                <InputField
                  id="diameter"
                  label="Internal Diameter (D)"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  placeholder="Ej: 1000"
                  required
                  unit="mm"
                />
              </div>
              
              <div>
                <InputField
                  id="stressValue"
                  label={
                    <div className="flex items-center">
                      Stress Value (S)
                      <InfoTooltip text="Valor de tensión del material según ASME Sec II D" />
                    </div>
                  }
                  value={stressValue}
                  onChange={(e) => setStressValue(e.target.value)}
                  placeholder="Ej: 137.9"
                  required
                  unit="MPa"
                />
                
                <InputField
                  id="efficiency"
                  label={
                    <div className="flex items-center">
                      Joint Efficiency (E)
                      <InfoTooltip text="Factor de eficiencia de junta, 0.7 a 1.0" />
                    </div>
                  }
                  value={efficiency}
                  onChange={(e) => setEfficiency(e.target.value)}
                  placeholder="Ej: 0.85"
                  min={0}
                  max={1}
                  required
                />
                
                <InputField
                  id="corrosionAllowance"
                  label="Corrosion Allowance"
                  value={corrosionAllowance}
                  onChange={(e) => setCorrosionAllowance(e.target.value)}
                  placeholder="Ej: 3"
                  min={0}
                  required
                  unit="mm"
                />
              </div>
            </div>
            
            <Button type="submit" className="mt-6">
              Calcular Espesores Requeridos
            </Button>
          </form>

          {/* === RESULTADOS DE ESPESOR === */}
          <ResultBox visible={showThicknessResults} title="Espesores Requeridos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValueDisplay 
                label="Shell Required Thickness" 
                value={`${reqShellThk} mm`} 
                highlight={true}
                delay={0.1}
              />
              <ValueDisplay 
                label="Heads Required Thickness" 
                value={`${reqHeadsThk} mm`} 
                highlight={true}
                delay={0.2}
              />
            </div>
          </ResultBox>

          {/* === FORM CON ESPESORES NOMINALES === */}
          {showNominalForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <h2 className="text-xl font-semibold text-asme-blue mb-4">
                Espesores Nominales y Cálculo de Pesos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputField
                    id="shellNominalThk"
                    label="Espesor Nominal Shell (incl. corrosión)"
                    value={shellNominalThk}
                    onChange={(e) => setShellNominalThk(e.target.value)}
                    placeholder="Ej: 10"
                    required
                    unit="mm"
                  />
                  
                  <InputField
                    id="headsNominalThk"
                    label="Espesor Nominal Heads (incl. corrosión)"
                    value={headsNominalThk}
                    onChange={(e) => setHeadsNominalThk(e.target.value)}
                    placeholder="Ej: 12"
                    required
                    unit="mm"
                  />
                  
                  <InputField
                    id="cylinderHeight"
                    label="Cylinder Height"
                    value={cylinderHeight}
                    onChange={(e) => setCylinderHeight(e.target.value)}
                    placeholder="Ej: 3000"
                    required
                    unit="mm"
                  />
                </div>
                
                <div>
                  <InputField
                    id="materialDensity"
                    label="Material Density"
                    value={materialDensity}
                    onChange={(e) => setMaterialDensity(e.target.value)}
                    placeholder="Ej: 7850"
                    required
                    unit="kg/m³"
                  />
                  
                  <InputField
                    id="operationFluidHeight"
                    label="Operation Fluid Height"
                    value={operationFluidHeight}
                    onChange={(e) => setOperationFluidHeight(e.target.value)}
                    placeholder="Ej: 2500"
                    required
                    unit="mm"
                  />
                  
                  <InputField
                    id="operationFluidDensity"
                    label="Operation Fluid Density"
                    value={operationFluidDensity}
                    onChange={(e) => setOperationFluidDensity(e.target.value)}
                    placeholder="Ej: 1000"
                    required
                    unit="kg/m³"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <Button onClick={handleCalculateMAWP}>
                  Calcular MAWP / MAP
                </Button>
                <Button onClick={handleCalculateWeights}>
                  Calcular Pesos
                </Button>
              </div>
            </motion.div>
          )}

          {/* === RESULTADOS MAWP === */}
          <ResultBox visible={showMawpResults}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValueDisplay 
                label="MAWP" 
                value={`${mawpValue} barg`} 
                highlight={true}
                delay={0.1}
              />
              <ValueDisplay 
                label="MAP" 
                value={`${mapValue} barg`} 
                delay={0.2}
              />
            </div>
          </ResultBox>

          {/* === RESULTADOS DE PESO === */}
          <WeightResult 
            visible={showWeightResults}
            results={weightResults}
          />

          {/* === BOTÓN RESET === */}
          {(showThicknessResults || showNominalForm) && (
            <div className="mt-6">
              <Button onClick={handleReset} variant="danger">
                Reset
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;

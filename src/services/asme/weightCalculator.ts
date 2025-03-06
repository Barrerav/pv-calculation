
// ASME Weight Calculation Module
import { calcHeadsVolume, volumeHeadsFluid } from './volumeCalculator';

export interface WeightResults {
  volumeShell: number;
  weightShell: number;
  volumeHeads: number;
  weightHeads: number;
  weightOpFluid: number;
  weightEmpty: number;
  weightOperation: number;
  weightTest: number;
}

export const calculateWeights = (
  shellNomThk: number,
  headsNomThk: number,
  headsType: string,
  D: number,
  cylinderHeight: number,
  materialDensity: number,
  opFluidHeight: number,
  opFluidDensity: number
): WeightResults => {
  // Convert to meters
  const shellNomThkM = shellNomThk / 1000;
  const headsNomThkM = headsNomThk / 1000;
  const cylinderHeightM = cylinderHeight / 1000;
  const opFluidHeightM = opFluidHeight / 1000;

  // Radio interno en m
  const rInt = (D / 1000) / 2;

  // ========== 1) PESO DEL METAL ==========
  // a) Shell
  const rExtShell = rInt + shellNomThkM;
  const volCylInt = Math.PI * Math.pow(rInt, 2) * cylinderHeightM;
  const volCylExt = Math.PI * Math.pow(rExtShell, 2) * cylinderHeightM;
  const volumeShell = volCylExt - volCylInt;
  const weightShell = volumeShell * materialDensity;

  // b) Heads
  const rExtHeads = rInt + headsNomThkM;
  const volumeHeads = calcHeadsVolume(headsType, rInt, rExtHeads);
  const weightHeads = volumeHeads * materialDensity;

  // c) Peso vacío
  const weightEmpty = weightShell + weightHeads;

  // ========== 2) PESO FLUIDO OPERACIÓN ==========
  const volumeOpFluid = Math.PI * Math.pow(rInt, 2) * opFluidHeightM; 
  const weightOpFluid = volumeOpFluid * opFluidDensity;
  const weightOperation = weightEmpty + weightOpFluid;

  // ========== 3) PESO DE PRUEBA (llenando cilindro + cabezas con agua) ==========
  const volumeCylIntFull = Math.PI * Math.pow(rInt, 2) * cylinderHeightM;
  const volumeHeadsInt = volumeHeadsFluid(headsType, rInt);
  const volumeTestFluid = volumeCylIntFull + volumeHeadsInt;
  const weightTestFluid = volumeTestFluid * 1000; // densidad de agua ~1000 kg/m³
  const weightTest = weightEmpty + weightTestFluid;

  return {
    volumeShell,
    weightShell,
    volumeHeads,
    weightHeads,
    weightOpFluid,
    weightEmpty,
    weightOperation,
    weightTest
  };
};


// ASME Calculator Service

// Format number with thousands separator and 2 decimal places
export const formatNumber = (num: number): string => {
  if (isNaN(num)) return '0,00';
  const fixed = num.toFixed(2);
  const parts = fixed.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return integerPart + ',' + parts[1];
};

// CALCULATIONS

// Calculate Required Shell Thickness
export const calculateRequiredShellThickness = (
  P: number, 
  D: number, 
  S: number, 
  E: number, 
  CA: number
): number => {
  // Radio
  const R = D/2;
  // Fórmulas ASME Div.1, circunferencial y longitudinal
  const t1 = (P * R) / (S * E - 0.6 * P);
  const t2 = (P * R) / (2 * S * E + 0.4 * P);
  return Math.max(t1, t2) + CA;
};

// Calculate Required Heads Thickness
export const calculateRequiredHeadsThickness = (
  headsType: string, 
  P: number, 
  D: number, 
  S: number, 
  E: number, 
  CA: number
): number => {
  let reqH = 0;
  switch(headsType){
    case 'hemispherical':
      // t = (P * R) / (2*S*E - 0.2P) + CA  (R = D/2)
      const R = D/2;
      reqH = (P * R)/(2 * S * E - 0.2 * P) + CA;
      break;
    case 'ellipsoidal':
      // t = (P * D) / (2*S*E - 0.2P) + CA  (2:1 elipsoidal)
      reqH = (P * D)/(2 * S * E - 0.2 * P) + CA;
      break;
    case 'torispherical':
      // t = (0.885 * P * D) / (S*E - 0.1P) + CA
      reqH = (0.885 * P * D)/(S * E - 0.1 * P) + CA;
      break;
  }
  return reqH;
};

// Calculate MAWP/MAP
export const calculateMAWP_MAP = (
  shellNomThk: number,
  headsNomThk: number,
  headsType: string,
  D: number,
  S: number,
  E: number,
  CA: number
): { MAWP: number, MAP: number } => {
  // t_eff = nominal - CA (para MAWP)
  // t_full= nominal      (para MAP)
  const effShell = shellNomThk - CA; 
  const effHeads = headsNomThk - CA;
  const R = D/2; // mm

  let MAWPShellMPa = 999999, MAWPHeadMPa = 999999;

  // --- MAWP Shell ---
  if(effShell > 0){
    const s1 = (S * E * effShell)/(R + 0.6 * effShell);
    const s2 = (2 * S * E * effShell)/(D - 1.2 * effShell);
    MAWPShellMPa = Math.min(s1, s2);
  }
  
  // --- MAWP Heads ---
  if(effHeads > 0){
    switch(headsType){
      case 'hemispherical':
      case 'ellipsoidal':
        // P = 2*S*E*t / (D + 0.2t)
        MAWPHeadMPa = (2 * S * E * effHeads)/(D + 0.2 * effHeads);
        break;
      case 'torispherical':
        // P = S*E*t / (0.885D + 0.1t)
        MAWPHeadMPa = (S * E * effHeads)/(0.885 * D + 0.1 * effHeads);
        break;
    }
  }
  
  // MAWP en barg
  const MAWP_barg = Math.min(MAWPShellMPa, MAWPHeadMPa) * 10; 

  // --- MAP Shell (t_full) ---
  let MAPShellMPa = 999999, MAPHeadMPa = 999999;
  
  const s1_full = (S * E * shellNomThk)/(R + 0.6 * shellNomThk);
  const s2_full = (2 * S * E * shellNomThk)/(D - 1.2 * shellNomThk);
  MAPShellMPa = Math.min(s1_full, s2_full);
  
  // --- MAP Heads (t_full) ---
  switch(headsType){
    case 'hemispherical':
    case 'ellipsoidal':
      MAPHeadMPa = (2 * S * E * headsNomThk)/(D + 0.2 * headsNomThk);
      break;
    case 'torispherical':
      MAPHeadMPa = (S * E * headsNomThk)/(0.885 * D + 0.1 * headsNomThk);
      break;
  }
  
  // MAP en barg
  const MAP_barg = Math.min(MAPShellMPa, MAPHeadMPa) * 10;

  return { MAWP: MAWP_barg, MAP: MAP_barg };
};

// Volume calculation helpers
// 1) Hemisférica => (2/3)*π*(rExt^3 - rInt^3) para 1 cabeza
const volumeHemis = (rInt: number, rExt: number): number => {
  const volInt = (2/3) * Math.PI * Math.pow(rInt, 3);
  const volExt = (2/3) * Math.PI * Math.pow(rExt, 3);
  return volExt - volInt; 
};

// 2) Elipsoidal (2:1) => factor ~0.848 vs. hemisférica
const volumeEllipsoidal = (rInt: number, rExt: number): number => {
  const factor = 0.848; 
  const volInt = factor * (2/3) * Math.PI * Math.pow(rInt, 3);
  const volExt = factor * (2/3) * Math.PI * Math.pow(rExt, 3);
  return volExt - volInt;
};

// 3) Torispherical => factor ~0.9 vs. hemisférica
const volumeTorispherical = (rInt: number, rExt: number): number => {
  const factor = 0.9;
  const volInt = factor * (2/3) * Math.PI * Math.pow(rInt, 3);
  const volExt = factor * (2/3) * Math.PI * Math.pow(rExt, 3);
  return volExt - volInt;
};

// Calculate heads volume based on type
export const calcHeadsVolume = (type: string, rInt: number, rExt: number): number => {
  switch(type){
    case 'hemispherical':
      return 2 * volumeHemis(rInt, rExt);
    case 'ellipsoidal':
      return 2 * volumeEllipsoidal(rInt, rExt);
    case 'torispherical':
      return 2 * volumeTorispherical(rInt, rExt);
    default:
      return 0;
  }
};

// Calculate volume of fluid in heads
export const volumeHeadsFluid = (type: string, rInt: number): number => {
  switch(type){
    case 'hemispherical':
      return 2 * ((2/3) * Math.PI * Math.pow(rInt, 3)); // 2 * media esfera
    case 'ellipsoidal':
      return 2 * (0.848 * (2/3) * Math.PI * Math.pow(rInt, 3));
    case 'torispherical':
      return 2 * (0.9 * (2/3) * Math.PI * Math.pow(rInt, 3));
    default:
      return 0;
  }
};

// Calculate weights
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

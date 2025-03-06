
// ASME Thickness Calculation Module

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

// Get detailed calculation steps for shell thickness
export const getShellThicknessCalculationSteps = (
  P: number, 
  D: number, 
  S: number, 
  E: number, 
  CA: number
): { t1: number, t2: number, maxT: number, finalT: number } => {
  const R = D/2;
  const t1 = (P * R) / (S * E - 0.6 * P);
  const t2 = (P * R) / (2 * S * E + 0.4 * P);
  const maxT = Math.max(t1, t2);
  const finalT = maxT + CA;
  return { t1, t2, maxT, finalT };
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

// Get detailed calculation steps for heads thickness
export const getHeadsThicknessCalculationSteps = (
  headsType: string, 
  P: number, 
  D: number, 
  S: number, 
  E: number, 
  CA: number
): { baseT: number, finalT: number } => {
  let baseT = 0;
  
  switch(headsType){
    case 'hemispherical':
      const R = D/2;
      baseT = (P * R)/(2 * S * E - 0.2 * P);
      break;
    case 'ellipsoidal':
      baseT = (P * D)/(2 * S * E - 0.2 * P);
      break;
    case 'torispherical':
      baseT = (0.885 * P * D)/(S * E - 0.1 * P);
      break;
  }
  
  const finalT = baseT + CA;
  return { baseT, finalT };
};

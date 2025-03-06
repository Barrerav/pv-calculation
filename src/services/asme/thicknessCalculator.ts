
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


// ASME Pressure Calculation Module

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

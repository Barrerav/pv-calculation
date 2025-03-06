
// ASME Volume Calculation Module

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

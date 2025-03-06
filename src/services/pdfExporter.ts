
import jsPDF from 'jspdf';

interface PdfData {
  // Form data
  headsType: string;
  pressure: string;
  diameter: string;
  stressValue: string;
  efficiency: string;
  corrosionAllowance: string;
  
  // Thickness results
  reqShellThk: string;
  reqHeadsThk: string;
  
  // Nominal data
  shellNominalThk: string;
  headsNominalThk: string;
  cylinderHeight: string;
  materialDensity: string;
  operationFluidHeight: string;
  operationFluidDensity: string;
  
  // MAWP/MAP results
  mawpValue: string;
  mapValue: string;
  
  // Weight results
  weightResults: {
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

export const exportToPdf = (data: PdfData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(0, 54, 69); // Dark blue
  doc.text('ASME Sec. VIII Div.1 Calculator Report', pageWidth/2, y, { align: 'center' });
  y += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(41, 200, 193); // Teal
  doc.text('by Vicente Barrera', pageWidth/2, y, { align: 'center' });
  y += 15;
  
  // Input Data Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Input Data', 15, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  
  const getHeadsTypeLabel = (type: string) => {
    switch(type) {
      case 'hemispherical': return 'Hemispherical';
      case 'ellipsoidal': return 'Ellipsoidal (2:1)';
      case 'torispherical': return 'Torispherical';
      default: return type;
    }
  };
  
  // Convert string values to numeric for calculations
  const P = parseFloat(data.pressure);
  const D = parseFloat(data.diameter);
  const S = parseFloat(data.stressValue);
  const E = parseFloat(data.efficiency);
  const CA = parseFloat(data.corrosionAllowance);
  const R = D / 2;
  
  // Basic inputs
  doc.text(`Heads Type: ${getHeadsTypeLabel(data.headsType)}`, 20, y); y += 6;
  doc.text(`Design Pressure (P): ${data.pressure} barg`, 20, y); y += 6;
  doc.text(`Internal Diameter (D): ${data.diameter} mm`, 20, y); y += 6;
  doc.text(`Stress Value (S): ${data.stressValue} MPa`, 20, y); y += 6;
  doc.text(`Joint Efficiency (E): ${data.efficiency}`, 20, y); y += 6;
  doc.text(`Corrosion Allowance: ${data.corrosionAllowance} mm`, 20, y); y += 10;
  
  // Required Thickness Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Required Thickness Calculations', 15, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  
  // Shell thickness calculation with formulas
  doc.text('Shell Required Thickness:', 20, y); y += 6;
  doc.text('For circumferential stress:', 25, y); y += 6;
  doc.text(`t₁ = (P × R) / (S × E - 0.6 × P) + CA per UG-27(c)(1)`, 30, y); y += 6;
  doc.text(`t₁ = (${P.toFixed(2)} × ${R.toFixed(2)}) / (${S.toFixed(2)} × ${E.toFixed(2)} - 0.6 × ${P.toFixed(2)}) + ${CA.toFixed(2)}`, 30, y); y += 6;
  
  const t1 = (P * R) / (S * E - 0.6 * P);
  doc.text(`t₁ = ${t1.toFixed(2)} + ${CA.toFixed(2)} = ${(t1 + CA).toFixed(2)} mm`, 30, y); y += 8;
  
  doc.text('For longitudinal stress:', 25, y); y += 6;
  doc.text(`t₂ = (P × R) / (2 × S × E + 0.4 × P) + CA per UG-27(c)(2)`, 30, y); y += 6;
  doc.text(`t₂ = (${P.toFixed(2)} × ${R.toFixed(2)}) / (2 × ${S.toFixed(2)} × ${E.toFixed(2)} + 0.4 × ${P.toFixed(2)}) + ${CA.toFixed(2)}`, 30, y); y += 6;
  
  const t2 = (P * R) / (2 * S * E + 0.4 * P);
  doc.text(`t₂ = ${t2.toFixed(2)} + ${CA.toFixed(2)} = ${(t2 + CA).toFixed(2)} mm`, 30, y); y += 8;
  
  doc.text(`Required Shell Thickness = max(t₁, t₂) = ${data.reqShellThk} mm`, 25, y); y += 10;
  
  // Heads thickness calculation with formulas
  doc.text('Heads Required Thickness:', 20, y); y += 6;
  
  if (data.headsType === 'hemispherical') {
    doc.text('For hemispherical heads:', 25, y); y += 6;
    doc.text(`t = (P × R) / (2 × S × E - 0.2 × P) + CA`, 30, y); y += 6;
    doc.text(`t = (${P.toFixed(2)} × ${R.toFixed(2)}) / (2 × ${S.toFixed(2)} × ${E.toFixed(2)} - 0.2 × ${P.toFixed(2)}) + ${CA.toFixed(2)}`, 30, y); y += 6;
    
    const tHeads = (P * R) / (2 * S * E - 0.2 * P);
    doc.text(`t = ${tHeads.toFixed(2)} + ${CA.toFixed(2)} = ${(tHeads + CA).toFixed(2)} mm`, 30, y); y += 6;
  } else if (data.headsType === 'ellipsoidal') {
    doc.text('For ellipsoidal heads (2:1):', 25, y); y += 6;
    doc.text(`t = (P × D) / (2 × S × E - 0.2 × P) + CA`, 30, y); y += 6;
    doc.text(`t = (${P.toFixed(2)} × ${D.toFixed(2)}) / (2 × ${S.toFixed(2)} × ${E.toFixed(2)} - 0.2 × ${P.toFixed(2)}) + ${CA.toFixed(2)}`, 30, y); y += 6;
    
    const tHeads = (P * D) / (2 * S * E - 0.2 * P);
    doc.text(`t = ${tHeads.toFixed(2)} + ${CA.toFixed(2)} = ${(tHeads + CA).toFixed(2)} mm`, 30, y); y += 6;
  } else if (data.headsType === 'torispherical') {
    doc.text('For torispherical heads:', 25, y); y += 6;
    doc.text(`t = (0.885 × P × D) / (S × E - 0.1 × P) + CA`, 30, y); y += 6;
    doc.text(`t = (0.885 × ${P.toFixed(2)} × ${D.toFixed(2)}) / (${S.toFixed(2)} × ${E.toFixed(2)} - 0.1 × ${P.toFixed(2)}) + ${CA.toFixed(2)}`, 30, y); y += 6;
    
    const tHeads = (0.885 * P * D) / (S * E - 0.1 * P);
    doc.text(`t = ${tHeads.toFixed(2)} + ${CA.toFixed(2)} = ${(tHeads + CA).toFixed(2)} mm`, 30, y); y += 6;
  }
  
  doc.text(`Required Heads Thickness = ${data.reqHeadsThk} mm`, 25, y); y += 10;
  
  // Check if we need a new page
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  
  // If nominal thickness data is available
  if (data.shellNominalThk) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Nominal Thickness Data', 15, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text(`Shell Nominal Thickness: ${data.shellNominalThk} mm`, 20, y); y += 6;
    doc.text(`Heads Nominal Thickness: ${data.headsNominalThk} mm`, 20, y); y += 6;
    doc.text(`Cylinder Height: ${data.cylinderHeight} mm`, 20, y); y += 6;
    doc.text(`Material Density: ${data.materialDensity} kg/m³`, 20, y); y += 6;
    doc.text(`Operation Fluid Height: ${data.operationFluidHeight} mm`, 20, y); y += 6;
    doc.text(`Operation Fluid Density: ${data.operationFluidDensity} kg/m³`, 20, y); y += 10;
  }
  
  // If MAWP/MAP results are available
  if (data.mawpValue) {
    // Convert string values to numeric for calculations
    const shellNomThk = parseFloat(data.shellNominalThk);
    const headsNomThk = parseFloat(data.headsNominalThk);
    const effShell = shellNomThk - CA;
    const effHeads = headsNomThk - CA;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('MAWP / MAP Calculations', 15, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    
    // MAWP Calculations
    doc.text('Maximum Allowable Working Pressure (MAWP):', 20, y); y += 6;
    doc.text(`Effective Shell Thickness = Nominal - CA = ${shellNomThk.toFixed(2)} - ${CA.toFixed(2)} = ${effShell.toFixed(2)} mm`, 25, y); y += 6;
    doc.text(`Effective Heads Thickness = Nominal - CA = ${headsNomThk.toFixed(2)} - ${CA.toFixed(2)} = ${effHeads.toFixed(2)} mm`, 25, y); y += 8;
    
    // MAWP Shell calculations
    doc.text('MAWP Shell:', 25, y); y += 6;
    doc.text('For circumferential stress:', 30, y); y += 6;
    doc.text(`P₁ = (S × E × t) / (R + 0.6 × t) per UG-27(c)(1)`, 35, y); y += 6;
    doc.text(`P₁ = (${S.toFixed(2)} × ${E.toFixed(2)} × ${effShell.toFixed(2)}) / (${R.toFixed(2)} + 0.6 × ${effShell.toFixed(2)})`, 35, y); y += 6;
    
    const p1 = (S * E * effShell) / (R + 0.6 * effShell);
    doc.text(`P₁ = ${p1.toFixed(2)} MPa = ${(p1 * 10).toFixed(2)} barg`, 35, y); y += 8;
    
    doc.text('For longitudinal stress:', 30, y); y += 6;
    doc.text(`P₂ = (2 × S × E × t) / (D - 1.2 × t) per UG-27(c)(2)`, 35, y); y += 6;
    doc.text(`P₂ = (2 × ${S.toFixed(2)} × ${E.toFixed(2)} × ${effShell.toFixed(2)}) / (${D.toFixed(2)} - 1.2 × ${effShell.toFixed(2)})`, 35, y); y += 6;
    
    const p2 = (2 * S * E * effShell) / (D - 1.2 * effShell);
    doc.text(`P₂ = ${p2.toFixed(2)} MPa = ${(p2 * 10).toFixed(2)} barg`, 35, y); y += 6;
    
    const mawpShell = Math.min(p1, p2) * 10;
    doc.text(`MAWP Shell = min(P₁, P₂) = ${mawpShell.toFixed(2)} barg`, 30, y); y += 10;
    
    // Check if we need a new page
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    
    // MAWP Heads calculations
    doc.text('MAWP Heads:', 25, y); y += 6;
    
    let mawpHeadCalc = '';
    let mawpHead = 0;
    
    if (data.headsType === 'hemispherical' || data.headsType === 'ellipsoidal') {
      const headFormula = data.headsType === 'hemispherical' ? 'P = (2 × S × E × t) / (D + 0.2 × t)' : 'P = (2 × S × E × t) / (D + 0.2 × t)';
      doc.text(`${headFormula}`, 30, y); y += 6;
      doc.text(`P = (2 × ${S.toFixed(2)} × ${E.toFixed(2)} × ${effHeads.toFixed(2)}) / (${D.toFixed(2)} + 0.2 × ${effHeads.toFixed(2)})`, 30, y); y += 6;
      
      mawpHead = (2 * S * E * effHeads) / (D + 0.2 * effHeads) * 10;
      doc.text(`P = ${(mawpHead/10).toFixed(2)} MPa = ${mawpHead.toFixed(2)} barg`, 30, y); y += 6;
    } else if (data.headsType === 'torispherical') {
      doc.text(`P = (S × E × t) / (0.885 × D + 0.1 × t)`, 30, y); y += 6;
      doc.text(`P = (${S.toFixed(2)} × ${E.toFixed(2)} × ${effHeads.toFixed(2)}) / (0.885 × ${D.toFixed(2)} + 0.1 × ${effHeads.toFixed(2)})`, 30, y); y += 6;
      
      mawpHead = (S * E * effHeads) / (0.885 * D + 0.1 * effHeads) * 10;
      doc.text(`P = ${(mawpHead/10).toFixed(2)} MPa = ${mawpHead.toFixed(2)} barg`, 30, y); y += 6;
    }
    
    doc.text(`MAWP Heads = ${mawpHead.toFixed(2)} barg`, 30, y); y += 8;
    
    // Final MAWP
    const mawp = Math.min(mawpShell, mawpHead);
    doc.text(`MAWP = min(MAWP Shell, MAWP Heads) = ${mawp.toFixed(2)} barg`, 25, y); y += 10;
    
    // MAP Calculations
    doc.text('Maximum Allowable Pressure (MAP):', 20, y); y += 6;
    doc.text('Similar calculations as MAWP but using nominal thickness instead of effective thickness', 25, y); y += 6;
    doc.text(`MAP = ${data.mapValue} barg`, 25, y); y += 10;
  }
  
  // If weight results are available
  if (data.weightResults && data.weightResults.volumeShell) {
    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Weight Calculations', 15, y);
    y += 8;
    
    // Convert values to numeric
    const D = parseFloat(data.diameter);
    const shellThk = parseFloat(data.shellNominalThk);
    const headsThk = parseFloat(data.headsNominalThk);
    const cylHeight = parseFloat(data.cylinderHeight);
    const matDensity = parseFloat(data.materialDensity);
    const fluidHeight = parseFloat(data.operationFluidHeight);
    const fluidDensity = parseFloat(data.operationFluidDensity);
    
    // Convert to meters for calculations
    const rInt = (D / 1000) / 2;
    const shellThkM = shellThk / 1000;
    const cylHeightM = cylHeight / 1000;
    
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    
    // Shell volume calculation
    doc.text('Shell Volume Calculation:', 20, y); y += 6;
    doc.text(`Internal radius (r_int) = D/2 = ${D.toFixed(2)}/2 = ${(D/2).toFixed(2)} mm = ${rInt.toFixed(4)} m`, 25, y); y += 6;
    doc.text(`External radius (r_ext) = r_int + shell thickness = ${rInt.toFixed(4)} + ${shellThkM.toFixed(4)} = ${(rInt + shellThkM).toFixed(4)} m`, 25, y); y += 6;
    doc.text(`V_shell = π × (r_ext² - r_int²) × h`, 25, y); y += 6;
    doc.text(`V_shell = π × ((${(rInt + shellThkM).toFixed(4)})² - (${rInt.toFixed(4)})²) × ${cylHeightM.toFixed(4)}`, 25, y); y += 6;
    doc.text(`V_shell = ${data.weightResults.volumeShell} m³`, 25, y); y += 6;
    doc.text(`Weight_shell = V_shell × material density = ${data.weightResults.volumeShell} × ${matDensity} = ${data.weightResults.weightShell} kg`, 25, y); y += 10;
    
    // Heads volume calculation
    doc.text('Heads Volume Calculation:', 20, y); y += 6;
    doc.text(`Using ${getHeadsTypeLabel(data.headsType)} heads formula with r_int = ${rInt.toFixed(4)} m, thickness = ${(headsThk/1000).toFixed(4)} m`, 25, y); y += 6;
    doc.text(`V_heads = ${data.weightResults.volumeHeads} m³`, 25, y); y += 6;
    doc.text(`Weight_heads = V_heads × material density = ${data.weightResults.volumeHeads} × ${matDensity} = ${data.weightResults.weightHeads} kg`, 25, y); y += 10;
    
    // Operation fluid
    doc.text('Operation Fluid Calculation:', 20, y); y += 6;
    doc.text(`V_fluid = π × r_int² × fluid height = π × (${rInt.toFixed(4)})² × ${(fluidHeight/1000).toFixed(4)}`, 25, y); y += 6;
    doc.text(`Weight_fluid = V_fluid × fluid density = V_fluid × ${fluidDensity} = ${data.weightResults.weightOpFluid} kg`, 25, y); y += 10;
    
    // Total weights
    doc.setTextColor(244, 58, 79); // Red
    doc.setFont('helvetica', 'bold');
    doc.text(`Empty Total Weight = Shell + Heads = ${data.weightResults.weightShell} + ${data.weightResults.weightHeads} = ${data.weightResults.weightEmpty} kg`, 20, y); y += 6;
    doc.text(`Operation Total Weight = Empty + Fluid = ${data.weightResults.weightEmpty} + ${data.weightResults.weightOpFluid} = ${data.weightResults.weightOperation} kg`, 20, y); y += 6;
    doc.text(`Test Total Weight (water filled) = ${data.weightResults.weightTest} kg`, 20, y);
    
    // Reset to normal font
    doc.setFont('helvetica', 'normal');
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated on: ${today}`, pageWidth - 15, 285, { align: 'right' });
  
  // Save the PDF
  doc.save('ASME_Calculator_Report.pdf');
};


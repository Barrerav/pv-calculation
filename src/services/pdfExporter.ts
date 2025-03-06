
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
  doc.text('Required Thickness Results', 15, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  doc.text(`Shell Required Thickness: ${data.reqShellThk} mm`, 20, y); y += 6;
  doc.text(`Heads Required Thickness: ${data.reqHeadsThk} mm`, 20, y); y += 10;
  
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
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('MAWP / MAP Results', 15, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text(`MAWP: ${data.mawpValue} barg`, 20, y); y += 6;
    doc.text(`MAP: ${data.mapValue} barg`, 20, y); y += 10;
  }
  
  // If weight results are available
  if (data.weightResults && data.weightResults.volumeShell) {
    // Check if we need a new page
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Weight Results', 15, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text(`Shell Volume: ${data.weightResults.volumeShell} m³`, 20, y); y += 6;
    doc.text(`Shell Weight: ${data.weightResults.weightShell} kg`, 20, y); y += 6;
    doc.text(`Heads Volume: ${data.weightResults.volumeHeads} m³`, 20, y); y += 6;
    doc.text(`Heads Weight: ${data.weightResults.weightHeads} kg`, 20, y); y += 6;
    doc.text(`Operation Fluid Weight: ${data.weightResults.weightOpFluid} kg`, 20, y); y += 6;
    
    // Highlight important weights
    doc.setTextColor(244, 58, 79); // Red
    doc.setFontStyle('bold');
    doc.text(`Empty Total Weight: ${data.weightResults.weightEmpty} kg`, 20, y); y += 6;
    doc.text(`Operation Total Weight: ${data.weightResults.weightOperation} kg`, 20, y); y += 6;
    doc.text(`Test Total Weight (water filled): ${data.weightResults.weightTest} kg`, 20, y);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated on: ${today}`, pageWidth - 15, 285, { align: 'right' });
  
  // Save the PDF
  doc.save('ASME_Calculator_Report.pdf');
};

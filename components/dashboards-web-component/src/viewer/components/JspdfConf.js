const pdfConfig = {
  stampImage: { coordinates: { x: 40, y: 10 }, size: { x: 140, y: 21 } },
  themeColorImage: { coordinates: { x: 540, y: 0 }, size: { x: 50, y: 60 } },
  stampImageLandscape: { coordinates: { x: 10, y: 5 }, size: { x: 35, y: 6 } },
  stampImageDashboard: {
    coordinates: { x: 10, y: 5 },
    size: { x: 105, y: 16.5 }
  },
  title: { size: 10, coordinates: { x: 295, y: 90 } },
  LandscapeTitle: { size: 10, coordinates: { x: 45, y: 45 } },
  text: { size: 8, coordinates: { x: 40, y: 110 } },

  pdfTableStyles: {
    startY: 110,
    styles: {
      fontSize: 6,
      rowHeight: 15,
      lineColor: [255, 255, 255],
      lineWidth: 1,
      overflow: "linebreak"
    },
    columnStyles: { "1": { columnWidth: "auto" } },
    headerStyles: { fillColor: [201, 202, 197], textColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [240, 236, 224] },
    bodyStyles: { fillColor: [255, 255, 255] }
  }
};

export { pdfConfig };

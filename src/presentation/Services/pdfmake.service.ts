// src/services/invoice-pdf.service.ts
import PdfPrinter from "pdfmake";
import path from "path";
import { TDocumentDefinitions } from "pdfmake/interfaces";


export class PdfService {
  private printer: PdfPrinter;

  constructor() {
    const fontsDir = path.resolve(process.cwd(), "fonts");
    const fonts = {
      Roboto: {
        normal: path.join(fontsDir, "Roboto-Regular.ttf"),
        bold: path.join(fontsDir, "Roboto-Bold.ttf"),
        italics: path.join(fontsDir, "Roboto-Italic.ttf"),
        bolditalics: path.join(fontsDir, "Roboto-BoldItalic.ttf"),
      },
    };

    this.printer = new PdfPrinter(fonts);
  }

  generate(docDefinition: TDocumentDefinitions): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition);
  }
}

import PDFLoader from './pdf/pdf'


async function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const pdfLoader = new PDFLoader("document/pdf/test.pdf", canvas);
    await pdfLoader.init();
    await pdfLoader.loadPage(1);
    document.body.appendChild(pdfLoader.canvas);
}

main();
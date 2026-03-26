// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');
const { Readable } = require('stream');
const fs = require('fs');

const createLabels = (studentName, location, items,  boxCount, group) => {
    

    const doc = new PDFDocument({ margin: 100 });
    const buffers = [];
    const readableStream = new Readable({
        read(size) {
            const chunk = buffers.shift();
            if (chunk) {
                this.push(chunk);
            } else {
                this.push(null);
            }
        }
    });

    readableStream.on('error', (err) => {
        console.error('Stream error:', err);
    });

    doc.on('data', (chunk) => {
        buffers.push(chunk);
    });

    let barcodeCount = 0;

   function generateBarcode(text, index) {
    
        bwipjs.toBuffer({ bcid: 'code128', text: text.id+"", scale: 3, height: 8 }, function (err, png) {
            if (err) {
                console.error('Error generating barcode:', err);
                return;
            }

            const pageWidth = 595.276; 
            const pageHeight = 841.890; 

            const imgWidth = 350; 
            const imgHeight = 200;

            const xPos = (pageWidth - imgWidth) / 2;
            const yPos = (pageHeight - ((imgHeight*2))+25);

            const logo = fs.readFileSync('./emailing/Trend_Logo.png');

            
            doc.image(logo, xPos, 0, {
                fit: [350, 200],  
                align: 'center',  
                valign: 'center', 
            });


            doc.moveDown(6);

            // Unit ID
            doc.font('Helvetica-Bold').fontSize(20).text('Unit ID:', { continued: true, align: 'left' });
            doc.font('Helvetica').fontSize(20).text(` ${text.id}`, {align: 'right' });
            doc.moveDown(1);

            // Unit Name
            doc.font('Helvetica-Bold').fontSize(20).text('Unit Name:', { continued: true, align: 'left' });
            doc.font('Helvetica').fontSize(20).text(` ${text.name}`, {align: 'right' });
            doc.moveDown(1);

            // Student Name
            doc.font('Helvetica-Bold').fontSize(20).text('Student Name:', { continued: true, align: 'left' });
            doc.font('Helvetica').fontSize(20).text(` ${studentName}`, {align: 'right' });
            doc.moveDown(1);

            // Item count
            doc.font('Helvetica-Bold').fontSize(20).text('Item Count:', { continued: true, align: 'left' });
            doc.font('Helvetica').fontSize(20).text(` ${index+1} of ${boxCount}`, {align: 'right' });
            doc.moveDown(1);

            // Location
            doc.font('Helvetica-Bold').fontSize(20).text('Location:', { continued: true, align: 'left' });
            doc.font('Helvetica').fontSize(20).text(` ${location}`, {align: 'right' });
            doc.moveDown(1);

            doc.font('Helvetica-Bold').fontSize(20).text('Group:', { continued: true, align: 'left' });
            doc.font('Helvetica').fontSize(20).text(` ${group}`, {align: 'right' });
            doc.moveDown(1);

            // Instructions
            doc.font('Helvetica').fontSize(16).text('Please print out and attach to each item', { align: 'center' });
            doc.moveDown(1);  
            

            

            doc.image(png, xPos, yPos, {
                fit: [350, 200],
                align: 'center',
                valign: 'center',
            });

            

            barcodeCount++;

            if (barcodeCount === items.length) {
                doc.end();
            } else {
                doc.addPage();
            }
        });
    }

    items.forEach((barcodeText, index) => {
        generateBarcode(barcodeText, index);
    });

    return {
        doc: doc,
        stream: readableStream
    };

}



module.exports = createLabels;
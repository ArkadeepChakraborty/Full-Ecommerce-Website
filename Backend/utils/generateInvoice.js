import PDFDocument from 'pdfkit';
import fs from 'fs';
import QRCode from 'qrcode';

export const generateInvoice = async (order, filePath, callback) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Header - Order Number
    doc.fontSize(20).fillColor('black').text(`Order No: ${order._id}`, { align: 'left' });
    doc.fontSize(10).fillColor('green').text('Ready for Ship', { align: 'left' });
    doc.moveDown(0.8);

    // Add "Food Faction" heading (between Order number and Customer & Order)
    doc.fontSize(16).fillColor('#ff6f00').text('Food Faction', { align: 'left', underline: true });
    doc.moveDown(0.4);

    // QR Code
    const orderURL = `http://localhost:5173`;
    const qrCodeDataURL = await QRCode.toDataURL(orderURL);

    const startY = doc.y;
    doc.fontSize(12).fillColor('black').text('Customer & Order', { underline: true });
    doc.fontSize(10).text(`Name: ${order.userId.fullname}`);
    doc.text(`Email: ${order.userId.email}`);
    doc.text(`Phone: ${order.userId.phoneNumber}`);

    const qrX = 440;
    const qrY = startY - 40;
    doc.image(qrCodeDataURL, qrX, qrY, { width: 100, height: 100 });
    doc.moveDown(1);

    // Shipping & Billing Address
    const addressY = doc.y;

    // Shipping Address
    doc.fontSize(12).text('Shipping Address:', 50, addressY, { underline: true });
    doc.fontSize(10).text(order.receiveLocation || 'N/A', 50, addressY + 15, { width: 200 });

    // Billing Address (unique food counter locations)
    doc.fontSize(12).text('Billing Address:', 300, addressY, { underline: true });
    const billingAddressesSet = new Set(
      order.cartItems.map(item => item.food.food_counter_id?.location).filter(Boolean)
    );
    const billingAddresses = Array.from(billingAddressesSet).join(', ');
    doc.fontSize(10).text(billingAddresses || 'N/A', 300, addressY + 15, { width: 200 });

    doc.moveDown(1);

    // Items Table
    doc.fontSize(12).text('Items Ordered:', 50, doc.y, { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const headers = ['ITEM NAME', 'ITEM ID', 'FOOD COUNTER', 'QUANTITY', 'PRICE', 'TOTAL'];
    const columnWidths = [120, 100, 100, 60, 60, 60];
    let startX = 50;

    headers.forEach((header, i) => {
      doc.font('Helvetica-Bold').fontSize(10).text(header, startX, tableTop, {
        width: columnWidths[i],
        align: 'center'
      });
      startX += columnWidths[i];
    });

    let yPos = tableTop + 15;

    order.cartItems.forEach(item => {
      startX = 50;
      const counterName = item.food.food_counter_id?.name || 'Main Counter';
      const price = item.food.price || 0;

      const itemData = [
        item.food.name || 'N/A',
        String(item.food._id).slice(0, 10),
        counterName,
        item.quantity,
        `₹${price}`,
        `₹${item.totalPrice}`
      ];

      itemData.forEach((data, i) => {
        doc.font('Helvetica').fontSize(10).text(data.toString(), startX, yPos, {
          width: columnWidths[i],
          align: 'center'
        });
        startX += columnWidths[i];
      });

      yPos += 15;
    });

    doc.moveDown(0.5);

    // Invoice Summary
    const invoiceY = yPos + 15;
    doc.fontSize(12).text('Invoice:', 50, invoiceY, { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Invoice No: ${Math.floor(Math.random() * 1000000)}`, 50, invoiceY + 15);
    doc.text(`Amount: ₹${order.summary.totalAmount}`, 50);
    doc.text(`Customer: ${order.userId.fullname}`, 50);
    doc.text(`Status: ${order.status}`, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50);

    const summaryX = 460;
    doc.fontSize(12).text('Summary:', summaryX, invoiceY, { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Subtotal: ₹${order.summary.totalAmount}`, summaryX, invoiceY + 15);
    doc.text(`Total: ₹${(order.summary.totalAmount * 1.1).toFixed(2)}`, summaryX);
    doc.text(`Currency: INR`, summaryX);

    doc.end();
    writeStream.on('finish', callback);

  } catch (error) {
    console.error('Error generating invoice:', error);
    if (callback) callback(error);
  }
};

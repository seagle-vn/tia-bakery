/**
 * Google Apps Script for Automatic Order Confirmation Emails
 * This script automatically sends confirmation emails when new orders are added to Google Sheets
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet with order data
 * 2. Go to Extensions → Apps Script
 * 3. Copy this entire script and paste it there
 * 4. Update the configuration below
 * 5. Set up a trigger for onEdit function
 */

// ========================================
// CONFIGURATION - UPDATE THESE VALUES
// ========================================

const CONFIG = {
  // Your Google Sheet name (change "Sheet1" to your actual sheet name)
  SHEET_NAME: "Sheet1",
  
  // Your email for order notifications (change to your actual email)
  OWNER_EMAIL: "your-email@tiabakery.ca",
  
  // Email column index (0-based). If email is in column F, use index 5
  EMAIL_COLUMN_INDEX: 4, // Column E (0-based index)
  
  // Business information for email template
  BUSINESS: {
    name: "Tia Bakery",
    phone: "(555) 123-BAKE",
    email: "orders@tiabakery.ca",
    website: "https://www.tiabakery.ca"
  }
};

// ========================================
// MAIN FUNCTIONS
// ========================================

/**
 * Main trigger function that runs on sheet edits
 * This function is called automatically when the sheet is edited
 */
function onEdit(e) {
  try {
    // Only run on the correct sheet
    if (e.source.getActiveSheet().getName() !== CONFIG.SHEET_NAME) {
      console.log(`Edit not on target sheet. Current sheet: ${e.source.getActiveSheet().getName()}`);
      return;
    }
    
    // Only run when a new row is added (not header row)
    const editedRow = e.range.getRow();
    if (editedRow < 2) {
      console.log(`Edit in header row ${editedRow}, skipping`);
      return;
    }
    
    // Only run if it's a new row addition (check if the row was empty before)
    const range = e.range;
    if (range.getColumn() === 1) { // Name column was edited
      console.log(`New order detected in row ${editedRow}`);
      sendOrderConfirmationEmail(editedRow);
    }
    
  } catch (error) {
    console.error('Error in onEdit function:', error);
  }
}

/**
 * Sends order confirmation email to customer and owner
 * @param {number} rowNumber - The row number of the new order
 */
function sendOrderConfirmationEmail(rowNumber) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Get all data from the row (adjust column count as needed)
    const row = sheet.getRange(rowNumber, 1, 1, 13).getValues()[0];
    
    // Extract data from the row (adjust indices based on your column order)
    const orderData = {
      customerName: row[0],           // Column A
      customerPhone: row[1],          // Column B  
      address: row[2],                // Column C
      city: row[3],                   // Column D
      postalCode: row[4],             // Column E
      deliveryDate: row[5],           // Column F
      notes: row[6],                  // Column G
      paymentTiming: row[7],          // Column H
      paymentMethod: row[8],          // Column I
      total: row[9],                  // Column J
      products: row[10],              // Column K (JSON string)
      orderStatus: row[11],           // Column L
      orderDate: row[12],             // Column M
      customerEmail: row[CONFIG.EMAIL_COLUMN_INDEX] // Configurable email column
    };
    
    // Skip if no customer email
    if (!orderData.customerEmail || orderData.customerEmail.trim() === '') {
      console.log(`No email address found for row ${rowNumber}, skipping email`);
      return;
    }
    
    // Validate email format
    if (!isValidEmail(orderData.customerEmail)) {
      console.log(`Invalid email format: ${orderData.customerEmail}, skipping`);
      return;
    }
    
    // Create email content
    const emailSubject = `Order Confirmation - ${CONFIG.BUSINESS.name} (#${rowNumber})`;
    const emailBody = createEmailBody(orderData, rowNumber);
    
    // Send email to customer
    GmailApp.sendEmail(
      orderData.customerEmail,
      emailSubject,
      emailBody
    );
    console.log(`Order confirmation email sent to: ${orderData.customerEmail}`);
    
    // Send copy to owner/manager
    const ownerSubject = `New Order Received - #${rowNumber} (${orderData.customerName})`;
    GmailApp.sendEmail(
      CONFIG.OWNER_EMAIL,
      ownerSubject,
      emailBody
    );
    console.log(`Order notification sent to owner: ${CONFIG.OWNER_EMAIL}`);
    
    // Optional: Mark email as sent in the sheet (add a column for this)
    // sheet.getRange(rowNumber, 14).setValue('✅ Email Sent');
    
  } catch (error) {
    console.error(`Failed to send order confirmation email for row ${rowNumber}:`, error);
  }
}

/**
 * Creates the email body content
 * @param {Object} orderData - Object containing order information
 * @param {number} orderNumber - Order number
 * @returns {string} - Formatted email body
 */
function createEmailBody(orderData, orderNumber) {
  const formattedProducts = formatProductList(orderData.products);
  const deliveryDateFormatted = formatDate(orderData.deliveryDate);
  const orderDateFormatted = formatDate(orderData.orderDate);
  
  return `Dear ${orderData.customerName},

Thank you for your order! We've received your order and will start preparing it soon.

ORDER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number: #${orderNumber}
Order Date: ${orderDateFormatted}
Delivery Date: ${deliveryDateFormatted}

CUSTOMER INFORMATION:
Name: ${orderData.customerName}
Phone: ${orderData.customerPhone}
Email: ${orderData.customerEmail}
Address: ${orderData.address}, ${orderData.city} ${orderData.postalCode}

PRODUCTS ORDERED:
${formattedProducts}

PAYMENT INFORMATION:
When to Pay: ${orderData.paymentTiming}
Payment Method: ${orderData.paymentMethod}
Total Amount: $${orderData.total}

${orderData.notes ? `SPECIAL NOTES:\n${orderData.notes}\n\n` : ''}WHAT'S NEXT:
• We'll start preparing your order immediately
• You'll receive a call/text closer to your delivery date
• Payment will be collected ${orderData.paymentTiming === 'advanced' ? 'in advance via e-transfer' : 'at pickup/delivery'}
• Any questions? Just reply to this email or call us!

CONTACT INFORMATION:
📞 Phone: ${CONFIG.BUSINESS.phone}
📧 Email: ${CONFIG.BUSINESS.email}
🌐 Website: ${CONFIG.BUSINESS.website}

Thank you for choosing ${CONFIG.BUSINESS.name}! We appreciate your business and can't wait to serve you our delicious baked goods. 🥧

Best regards,
Tia & Team
${CONFIG.BUSINESS.name}

---
This is an automated confirmation email. If you have any questions, please contact us directly.`;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Formats the products JSON into a readable list
 * @param {string} productsJson - JSON string of products
 * @returns {string} - Formatted product list
 */
function formatProductList(productsJson) {
  try {
    if (!productsJson) return "No products listed";
    
    const products = JSON.parse(productsJson);
    if (!Array.isArray(products) || products.length === 0) {
      return "No products listed";
    }
    
    return products.map((product, index) => {
      const name = product.name || 'Unknown Product';
      const size = product.size ? ` (${product.size})` : '';
      const quantity = product.quantity || 1;
      const itemTotal = product.itemTotal || product.price || 0;
      const url = product.product_url ? `\n  Link: ${product.product_url}` : '';
      
      return `${index + 1}. ${name}${size}
   Quantity: ${quantity}
   Price: $${itemTotal}${url}`;
    }).join('\n\n');
    
  } catch (error) {
    console.error('Error parsing products JSON:', error);
    return `Products: ${productsJson}`;
  }
}

/**
 * Formats a date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  if (!date) return 'Not specified';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return date.toString();
  }
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ========================================
// TEST FUNCTIONS
// ========================================

/**
 * Test function to send a sample email (for testing purposes)
 * Run this function manually to test your setup
 */
function testEmailSetup() {
  console.log('Testing email setup...');
  
  // Test with row 2 (first data row after header)
  try {
    sendOrderConfirmationEmail(2);
    console.log('✅ Test email sent successfully!');
    console.log('Check your email and the customer email to verify delivery.');
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('Please check your configuration and try again.');
  }
}

/**
 * Test function to validate configuration
 */
function validateConfiguration() {
  console.log('Validating configuration...');
  
  const issues = [];
  
  // Check sheet name
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      issues.push(`Sheet "${CONFIG.SHEET_NAME}" not found`);
    } else {
      console.log(`✅ Sheet found: ${CONFIG.SHEET_NAME}`);
    }
  } catch (error) {
    issues.push(`Error accessing sheet: ${error.message}`);
  }
  
  // Check owner email
  if (!isValidEmail(CONFIG.OWNER_EMAIL)) {
    issues.push(`Invalid owner email: ${CONFIG.OWNER_EMAIL}`);
  } else {
    console.log(`✅ Owner email format valid: ${CONFIG.OWNER_EMAIL}`);
  }
  
  // Check email column index
  if (CONFIG.EMAIL_COLUMN_INDEX < 0) {
    issues.push(`Invalid email column index: ${CONFIG.EMAIL_COLUMN_INDEX}`);
  } else {
    console.log(`✅ Email column index: ${CONFIG.EMAIL_COLUMN_INDEX} (Column ${String.fromCharCode(65 + CONFIG.EMAIL_COLUMN_INDEX)})`);
  }
  
  if (issues.length === 0) {
    console.log('🎉 Configuration validation passed!');
    console.log('You can now test with testEmailSetup() function.');
  } else {
    console.log('❌ Configuration issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  return issues.length === 0;
}

// ========================================
// TRIGGER SETUP HELPER
// ========================================

/**
 * Sets up the onEdit trigger programmatically
 * Run this once if you prefer to set up triggers via code instead of UI
 */
function setupTrigger() {
  // Delete existing triggers for this function
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger
  ScriptApp.newTrigger('onEdit')
    .onEdit()
    .create();
    
  console.log('✅ onEdit trigger created successfully');
}
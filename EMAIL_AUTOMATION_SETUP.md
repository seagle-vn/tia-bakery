# 📧 Automatic Order Confirmation Email Setup

This guide will help you set up automatic order confirmation emails using Google Apps Script. When customers place orders, they'll receive professional confirmation emails automatically without any external email APIs.

## 🚀 Quick Setup Steps

### Step 1: Access Google Apps Script

1. **Open your Google Sheet** with order data
2. **Go to Extensions → Apps Script**
3. This opens the Google Apps Script editor

### Step 2: Install the Script

1. **Delete the default code** in the Apps Script editor
2. **Copy the entire contents** of `scripts/order-email-automation.js`
3. **Paste it** into the Apps Script editor
4. **Click Save** (Ctrl+S)

### Step 3: Customize for Your Sheet

**Important**: Update these values in the script:

```javascript
// Line 2: Change to your actual sheet name
if (e.source.getActiveSheet().getName() !== "YOUR_SHEET_NAME") return;

// Line 65: Add your email for order notifications
GmailApp.sendEmail('YOUR_EMAIL@example.com', `New Order Received - #${rowNumber}`, emailBody);
```

**Column Mapping**: Verify your Google Sheet column order matches:
- Column A: Customer Name
- Column B: Phone
- Column C: Address  
- Column D: City
- Column E: Postal Code
- Column F: Delivery Date
- Column G: Notes
- Column H: Payment Timing
- Column I: Payment Method
- Column J: Total
- Column K: Products (JSON)
- Column L: Order Status
- Column M: Order Date

> ⚠️ **Important**: The script assumes email is in column E. If your email is in a different column, update the `customerEmail` line in the script.

### Step 4: Set Up the Trigger

1. **Click Triggers** (⏰ clock icon) in the left sidebar
2. **Click + Add Trigger**
3. **Configure trigger**:
   - Function: `onEdit`
   - Event source: `From spreadsheet`
   - Event type: `On edit`
4. **Click Save**

### Step 5: Grant Permissions

1. **First run**: Google will request permissions
2. **Click "Review Permissions"**
3. **Sign in** with your Google account
4. **Click "Allow"** to grant access to:
   - Gmail (to send emails)
   - Google Sheets (to read order data)

### Step 6: Test the Setup

1. **Use the test function**:
   - In Apps Script editor, select `testEmail` from the function dropdown
   - Click **Run** (▶️ button)
   - Check if test email is sent successfully

2. **Test with real order**:
   - Add a test row to your sheet manually
   - Verify the email is sent automatically

## 📋 Features

### ✅ What the System Does

- **Automatic Emails**: Sends confirmation emails when new orders are added
- **Professional Template**: Clean, branded email with all order details
- **Customer Copy**: Customer receives detailed order confirmation
- **Owner Copy**: You receive notification of new orders
- **Product Details**: Formats product JSON into readable list
- **Order Tracking**: Includes order number and dates

### 📧 Email Template Includes

- Order number and dates
- Customer contact information
- Itemized product list with quantities and prices
- Payment information and total amount
- Special notes (if any)
- Next steps and contact information
- Professional Tia Bakery branding

## 🔧 Customization Options

### Email Template

Edit the `emailBody` variable in `sendOrderConfirmationEmail()` function to:
- Change wording and tone
- Add/remove sections
- Update contact information
- Modify branding

### Notification Recipients

```javascript
// Send to customer
GmailApp.sendEmail(customerEmail, subject, emailBody);

// Send copy to multiple people
GmailApp.sendEmail('owner@tiabakery.ca', subject, emailBody);
GmailApp.sendEmail('manager@tiabakery.ca', subject, emailBody);
```

### Column Mapping

If your Google Sheet has different column order, update the array indices:

```javascript
const customerName = row[0];    // Column A
const customerPhone = row[1];   // Column B
const customerEmail = row[4];   // Column E (change index as needed)
// ... etc
```

## ⚠️ Troubleshooting

### ❌ "Script function not found"
- Make sure you saved the script
- Verify the trigger is set to `onEdit` function

### ❌ "Permission denied"
- Re-run the permission setup
- Make sure you're signed in to the correct Google account

### ❌ "Email not sending"
- Check if customer email column contains valid email addresses
- Verify your Gmail account can send emails
- Check Google Apps Script quotas (100 emails/day for free accounts)

### ❌ "Emails sending for every edit"
- The script only sends for new rows (row 2+)
- If editing existing orders triggers emails, you may need to add additional checks

## 📊 Usage Limits

**Google Apps Script Free Tier**:
- 100 emails per day
- 6 minutes execution time per trigger
- 1GB total storage

For higher volume, consider upgrading to Google Workspace.

## 🔒 Security Notes

- Emails are sent from your Gmail account
- Customer email addresses are processed securely within Google's infrastructure
- No external APIs or third-party services involved
- All data stays within Google ecosystem

## 🆘 Support

If you encounter issues:

1. **Check the Apps Script logs**:
   - In Apps Script editor: View → Logs
   - Look for error messages

2. **Test step by step**:
   - Run `testEmail()` function manually
   - Check trigger configuration
   - Verify column mappings

3. **Common fixes**:
   - Update column indices for your sheet structure
   - Ensure email column contains valid addresses
   - Check Google account permissions

## 🎯 Next Steps

1. ✅ Complete the setup above
2. 🧪 Test with a few sample orders
3. 📈 Monitor email delivery success
4. 🎨 Customize email template as needed
5. 📊 Consider tracking email opens/clicks (optional)

---

*This automation will significantly improve customer experience and reduce your manual workload! 🚀*
# Google Drive Setup for Build Your Cake Menu

This guide shows how to set up Google Drive to manage the "Build Your Cake" menu content.

## 🎯 Overview

Your content team can update the Build Your Cake menu by simply editing a JSON file in Google Drive - no coding or technical knowledge required!

---

## Step 1: Upload the JSON File to Google Drive

### 1.1 Get the Template File

The template file is located at:
```
/public/data/cake-builder-template.json
```

### 1.2 Upload to Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Navigate to a folder (or create a new one called "Website Content")
3. Click **"New" > "File upload"**
4. Select `cake-builder-template.json` from your project
5. Rename it to `cake-builder.json` (remove "-template")

---

## Step 2: Make the File Publicly Accessible

### 2.1 Share Settings

1. **Right-click** the uploaded `cake-builder.json` file
2. Click **"Share"**
3. Click **"Change to anyone with the link"** at the bottom
4. Make sure it's set to **"Viewer"** (not Editor)
5. Click **"Copy link"**
6. Click **"Done"**

### 2.2 Get the File ID

From the copied link, extract the File ID:

**Example link:**
```
https://drive.google.com/file/d/1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P/view?usp=sharing
```

**File ID is:** `1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P` (the part between `/d/` and `/view`)

---

## Step 3: Configure Your Project

### 3.1 Add to Environment Variables

1. Open your project's `.env.local` file (create if it doesn't exist)
2. Add this line with your File ID:

```env
NEXT_PUBLIC_CAKE_BUILDER_FILE_ID=YOUR_FILE_ID_HERE
```

**Example:**
```env
NEXT_PUBLIC_CAKE_BUILDER_FILE_ID=1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P
```

### 3.2 Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 4: How Your Team Updates the Menu

### 4.1 Edit the File

Your content team can update the menu by:

1. Opening Google Drive
2. Finding the `cake-builder.json` file
3. Right-click → **"Open with" → "Google Docs"** or download and edit with a text editor
4. Make changes (see editing guide below)
5. Save/re-upload the file

**Note:** Changes appear on the website within 5 minutes (cached)

### 4.2 Understanding the JSON Structure

```json
{
  "active": true,  // Set to false to hide the section
  "title": "Build Your Cake",
  "subtitle": "Choose your cake, then customise...",
  "cakeTypes": [
    {
      "id": "sponge-cake",  // Don't change this
      "name": "SPONGE CAKE WITH WHIPPING CREAM",
      "cakeFlavours": [
        "Vanilla",
        "Chocolate"
        // Add or remove flavours here
      ],
      "frostingFlavours": [...],
      "fillings": [...],
      "toppings": [...]
    }
  ]
}
```

### 4.3 Common Edits

**To add a new flavour:**
```json
"cakeFlavours": [
  "Vanilla",
  "Chocolate",
  "New Flavour Here"  // <-- Add comma to previous line, then add this
]
```

**To remove a flavour:**
Just delete the line (and the comma if it's not the last item)

**To hide the section temporarily:**
```json
"active": false
```

**To change the title or subtitle:**
```json
"title": "Your New Title",
"subtitle": "Your new description here"
```

---

## Step 5: Verify It Works

1. Go to your website homepage
2. Scroll to the "Build Your Cake" section
3. You should see the content from your Google Drive file
4. Try making a small change (add a flavour)
5. Wait 5 minutes (cache time)
6. Refresh the page to see your change

---

## 🔧 Troubleshooting

### Section doesn't appear

**Check:**
- [ ] `"active": true` in the JSON file
- [ ] File is publicly shared (Anyone with link can view)
- [ ] File ID is correct in `.env.local`
- [ ] Development server was restarted after adding env variable
- [ ] No JSON syntax errors (use https://jsonlint.com to validate)

### Changes don't show up

**Solutions:**
- Wait 5 minutes (caching)
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors (F12)

### JSON Syntax Errors

**Common mistakes:**
- Missing comma between items: `"Item 1" "Item 2"` ❌ → `"Item 1", "Item 2"` ✅
- Extra comma at end: `["Item 1", "Item 2",]` ❌ → `["Item 1", "Item 2"]` ✅
- Wrong quotes: `'Item'` ❌ → `"Item"` ✅ (use double quotes)

**Validation tool:** Paste your JSON into https://jsonlint.com to check for errors

---

## 📝 Tips for Your Content Team

### Best Practices

1. **Always validate JSON** before saving (use jsonlint.com)
2. **Keep a backup** - duplicate the file before major changes
3. **Test changes** - add one item at a time, not all at once
4. **Use consistent formatting** - match the existing style
5. **Don't change IDs** - only change the visible text (names, titles, etc.)

### What They Can Safely Edit

✅ **Safe to edit:**
- `title` and `subtitle`
- `name` (cake type names)
- Items in `cakeFlavours`, `frostingFlavours`, `fillings`, `toppings` arrays
- `active` (true/false to show/hide)

❌ **Don't edit:**
- `id` fields (sponge-cake, golden-cake)
- JSON structure (brackets, braces, quotes)
- Field names (cakeFlavours, frostingFlavours, etc.)

### Quick Reference Card

Save this for your team:

```
TO ADD A FLAVOUR:
- Add comma after the last item
- Add: "New Flavour Name"

TO REMOVE A FLAVOUR:
- Delete the line
- Remove extra comma if needed

TO HIDE THE SECTION:
- Change "active": true to "active": false

NEED HELP?
- Validate JSON: https://jsonlint.com
- Contact: [your contact info]
```

---

## 🚀 Alternative: Using Google Drive Desktop App

For even easier editing:

1. Install [Google Drive Desktop](https://www.google.com/drive/download/)
2. Find the `cake-builder.json` file in your synced folder
3. Edit with any text editor (VS Code, Sublime, Notepad++)
4. Save - changes sync automatically to Google Drive
5. Website updates within 5 minutes

---

## 📊 File Structure Reference

```json
{
  "active": boolean,           // true = show, false = hide
  "title": string,             // Main heading
  "subtitle": string,          // Description text
  "cakeTypes": [               // Array of cake types
    {
      "id": string,            // Unique ID (don't change)
      "name": string,          // Display name (UPPERCASE)
      "cakeFlavours": [],      // Array of flavour names
      "frostingFlavours": [],  // Array of flavour names
      "fillings": [],          // Array of filling names
      "toppings": []           // Array of topping names
    }
  ]
}
```

---

## 🔄 Cache Information

- **Cache duration:** 5 minutes
- **Clear cache:** Hard refresh browser (Ctrl+Shift+R)
- **Production:** May need to redeploy for immediate updates (or wait for cache expiry)

---

## 📞 Support

If your content team needs help:

1. Check the JSON with https://jsonlint.com
2. Review the common mistakes section above
3. Restore from backup if needed
4. Contact your developer

---

## 🎉 Done!

Your team can now update the Build Your Cake menu anytime by simply editing a file in Google Drive - no coding required!

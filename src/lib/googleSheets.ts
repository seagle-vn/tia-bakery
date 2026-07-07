/**
 * Google Sheets Data Fetcher for Build Your Cake Menu
 *
 * Setup Instructions:
 * 1. Create a Google Sheet with the structure defined below
 * 2. Make the sheet publicly viewable (Share > Anyone with link can view)
 * 3. Get the Sheet ID from the URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
 * 4. Add NEXT_PUBLIC_CAKE_BUILDER_SHEET_ID to your .env.local
 */

const SHEET_ID = process.env.NEXT_PUBLIC_CAKE_BUILDER_SHEET_ID;

interface SheetRow {
  [key: string]: string;
}

interface CakeBuilderData {
  title: string;
  subtitle: string;
  cakeTypes: Array<{
    id: string;
    name: string;
    cakeFlavours: Array<{ id: string; name: string }>;
    frostingFlavours: Array<{ id: string; name: string }>;
    fillingOptions: Array<{ id: string; name: string }>;
    toppingOptions: Array<{ id: string; name: string }>;
  }>;
}

/**
 * Fetch data from Google Sheets using the public CSV export
 */
async function fetchSheetData(sheetName: string): Promise<SheetRow[]> {
  if (!SHEET_ID) {
    console.warn('Google Sheet ID not configured');
    return [];
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }

    const text = await response.text();
    // Google Sheets returns JSONP, we need to extract the JSON
    const json = text.substring(47).slice(0, -2);
    const data = JSON.parse(json);

    const rows: SheetRow[] = [];
    const headers = data.table.cols.map((col: any) => col.label || '');

    data.table.rows.forEach((row: any) => {
      const rowData: SheetRow = {};
      row.c.forEach((cell: any, index: number) => {
        rowData[headers[index]] = cell?.v?.toString() || '';
      });
      rows.push(rowData);
    });

    return rows;
  } catch (error) {
    console.error(`Error fetching sheet "${sheetName}":`, error);
    return [];
  }
}

/**
 * Parse sheet data into structured cake builder format
 */
export async function getCakeBuilderData(): Promise<CakeBuilderData | null> {
  try {
    // Fetch all sheets
    const [configRows, spongeCakeRows, goldenCakeRows] = await Promise.all([
      fetchSheetData('Config'),
      fetchSheetData('Sponge Cake'),
      fetchSheetData('Golden Cake'),
    ]);

    // Get config
    const config = configRows[0] || {};
    const isActive = config['Active']?.toLowerCase() === 'true';

    if (!isActive) {
      return null;
    }

    // Parse Sponge Cake data
    const spongeCake = {
      id: 'sponge-cake',
      name: 'SPONGE CAKE WITH WHIPPING CREAM',
      cakeFlavours: parseOptions(spongeCakeRows, 'Cake Flavour'),
      frostingFlavours: parseOptions(spongeCakeRows, 'Frosting Flavour'),
      fillingOptions: parseOptions(spongeCakeRows, 'Filling'),
      toppingOptions: parseOptions(spongeCakeRows, 'Topping'),
    };

    // Parse Golden Cake data
    const goldenCake = {
      id: 'golden-cake',
      name: 'GOLDEN CAKE WITH BUTTERCREAM',
      cakeFlavours: parseOptions(goldenCakeRows, 'Cake Flavour'),
      frostingFlavours: parseOptions(goldenCakeRows, 'Frosting Flavour'),
      fillingOptions: parseOptions(goldenCakeRows, 'Filling'),
      toppingOptions: parseOptions(goldenCakeRows, 'Topping'),
    };

    return {
      title: config['Title'] || 'Build Your Cake',
      subtitle: config['Subtitle'] || '',
      cakeTypes: [spongeCake, goldenCake],
    };
  } catch (error) {
    console.error('Error parsing cake builder data:', error);
    return null;
  }
}

/**
 * Parse options from sheet rows by column name
 */
function parseOptions(rows: SheetRow[], columnName: string): Array<{ id: string; name: string }> {
  return rows
    .map((row) => row[columnName])
    .filter((value) => value && value.trim() !== '')
    .map((name, index) => ({
      id: `${columnName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
      name: name.trim(),
    }));
}

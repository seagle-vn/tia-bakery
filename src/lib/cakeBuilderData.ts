/**
 * Cake Builder Data Fetcher - Google Drive Integration
 *
 * This fetches the Build Your Cake menu content from Google Drive
 */

interface CakeBuilderData {
  active: boolean;
  title: string;
  subtitle: string;
  cakeTypes: Array<{
    id: string;
    name: string;
    cakeFlavours: string[];
    frostingFlavours: string[];
    fillings: string[];
    toppings: string[];
  }>;
}

interface FormattedCakeBuilder {
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
 * Fetches cake builder data from Google Drive
 *
 * @returns Formatted cake builder data or null if inactive/error
 */
export async function getCakeBuilderData(): Promise<FormattedCakeBuilder | null> {
  try {
    // Fetch from our API route (server-side) to bypass CORS
    const url = '/api/cake-builder';

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch cake builder data:', response.statusText);
      return null;
    }

    const data: CakeBuilderData = await response.json();

    // Check if active
    if (!data.active) {
      return null;
    }

    // Transform data to match component interface
    return {
      title: data.title,
      subtitle: data.subtitle,
      cakeTypes: data.cakeTypes.map((cakeType) => ({
        id: cakeType.id,
        name: cakeType.name,
        cakeFlavours: transformToOptions(cakeType.cakeFlavours, 'cake-flavour'),
        frostingFlavours: transformToOptions(cakeType.frostingFlavours, 'frosting-flavour'),
        fillingOptions: transformToOptions(cakeType.fillings, 'filling'),
        toppingOptions: transformToOptions(cakeType.toppings, 'topping'),
      })),
    };
  } catch (error) {
    console.error('Error loading cake builder data:', error);
    return null;
  }
}

/**
 * Transform string array to option objects with IDs
 */
function transformToOptions(items: string[], prefix: string): Array<{ id: string; name: string }> {
  return items.map((item, index) => ({
    id: `${prefix}-${index + 1}`,
    name: item,
  }));
}

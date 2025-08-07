export const pageview = (GA_MEASUREMENT_ID: string, url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Utility function to format chat messages
export function formatMessageContent(content: string): string {
  const formatted = content
    .replace(/\*\s+/g, '• ') // Convert any * followed by space to bullet
    .replace(/\n\s*\n/g, '\n\n') // Clean up extra line breaks
    .trim(); // Remove leading/trailing whitespace
  return formatted;
}

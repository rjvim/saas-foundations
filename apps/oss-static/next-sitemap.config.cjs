/** @type {import('next-sitemap').IConfig} */

const baseUrl =
  process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_SITE_URL
    ? new URL("https://localhost:3000")
    : new URL(`https://${process.env.NEXT_PUBLIC_SITE_URL}`);

module.exports = {
  outDir: "out",
  siteUrl: baseUrl,
  generateRobotsTxt: true,
  transform: async (config, path) => {
    // custom function to ignore the path
    if (customIgnoreFunction(path)) {
      return null;
    }
    // Use default transformation for all other cases
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};

/**
 * Function to check if a path should be ignored
 * @param {string} path - The path to check
 * @returns {boolean} - True if the path should be ignored
 */
function customIgnoreFunction(path) {
  const pathsToIgnore = ["/api/", "opengraph-image-", "blogs-og"];

  return pathsToIgnore.some((pattern) => path.includes(pattern));
}

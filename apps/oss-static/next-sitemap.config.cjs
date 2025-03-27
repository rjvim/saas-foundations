/** @type {import('next-sitemap').IConfig} */

const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("https://localhost:3000")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

module.exports = {
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
  const pathsToIgnore = ["/api/"];

  return pathsToIgnore.some((pattern) => path.includes(pattern));
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://saas-foundations-oss-static.vercel.app",
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

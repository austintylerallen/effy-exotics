/** Maintenance sitemap: never advertise temporarily unavailable pages. */
module.exports = {
  siteUrl: 'https://effyexotics.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/**'],
  additionalPaths: async () => ['/', '/las-cruces/shop', '/alamogordo/shop'].map(loc => ({loc})),
  robotsTxtOptions: { policies: [{ userAgent: '*', allow: '/' }] },
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.effyexotics.com',
  generateRobotsTxt: true,
  exclude: [],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'monthly',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => [
    { loc: '/las-cruces' },
    { loc: '/las-cruces/about' },
    { loc: '/las-cruces/shop' },
    { loc: '/las-cruces/map' },
    { loc: '/las-cruces/the-lab' },

    { loc: '/alamogordo' },
    { loc: '/alamogordo/about' },
    { loc: '/alamogordo/shop' },
    { loc: '/alamogordo/map' },
    { loc: '/alamogordo/the-lab' }
  ]
}

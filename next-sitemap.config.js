/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.effyexotics.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    // next-sitemap will auto-emit the Sitemap: line
  },
  exclude: ['/api/*'],
  changefreq: 'monthly',
  priority: 0.7,
  transform: async (config, path) => {
    const isLocation = ['/las-cruces', '/alamogordo'].includes(path);
    return {
      loc: path,
      changefreq: isLocation ? 'daily' : config.changefreq,
      priority: isLocation ? 0.9 : (path === '/' ? 1.0 : 0.7),
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async () => [
    { loc: '/las-cruces' },
    { loc: '/las-cruces/about' },
    { loc: '/las-cruces/shop' },
    { loc: '/las-cruces/map' },
    { loc: '/las-cruces/the-lab' },
    { loc: '/las-cruces/faq' },
    { loc: '/alamogordo' },
    { loc: '/alamogordo/about' },
    { loc: '/alamogordo/shop' },
    { loc: '/alamogordo/map' },
    { loc: '/alamogordo/the-lab' },
    { loc: '/alamogordo/faq' },
  ],
};

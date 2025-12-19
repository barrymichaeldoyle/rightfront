/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Prefer setting one of these in your deployment env:
  // - NEXT_PUBLIC_SITE_URL (recommended)
  // - SITE_URL
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  // Keep utility / non-canonical routes out of the sitemap.
  exclude: ["/fallback", "/link"],
};

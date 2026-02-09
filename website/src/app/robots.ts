import { MetadataRoute } from 'next';

// TODO: Replace SITE_URL with actual domain when available
const SITE_URL = 'https://plenusobras.com.br'; // placeholder

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

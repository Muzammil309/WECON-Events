export const appConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'WECON Masawat',
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  allowedFrameAncestors: process.env.ALLOWED_FRAME_ANCESTORS || '*',
  wordpressAllowedOrigins: process.env.WORDPRESS_EMBED_ALLOWED_ORIGINS || '*',
  indico: {
    baseUrl: process.env.INDICO_BASE_URL || '',
    apiKey: process.env.INDICO_API_KEY || '',
  },
  attendize: {
    baseUrl: process.env.ATTENDIZE_BASE_URL || '',
    apiKey: process.env.ATTENDIZE_API_KEY || ''
  },
  nextcloud: {
    baseUrl: process.env.NEXTCLOUD_BASE_URL || '',
    username: process.env.NEXTCLOUD_USERNAME || '',
    password: process.env.NEXTCLOUD_PASSWORD || ''
  },
  metabase: {
    siteUrl: process.env.METABASE_SITE_URL || '',
    embedSecret: process.env.METABASE_EMBED_SECRET_KEY || ''
  },
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  }
};

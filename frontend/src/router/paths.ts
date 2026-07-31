export const paths = {
  home: '/',
  countries: '/countries',
  countryDetail: (countrySlug: string) => `/countries/${countrySlug}`,
  townDetail: (countrySlug: string, townSlug: string) =>
    `/countries/${countrySlug}/towns/${townSlug}`,
  activities: '/activities',
  activityDetail: (activitySlug: string) => `/activities/${activitySlug}`,
  ticket: (ticketCode: string) => `/tickets/${ticketCode}`,
  blog: '/blog',
  blogPost: (slug: string) => `/blog/${slug}`,
  about: '/about',
  contact: '/contact',

  adminLogin: '/admin/login',
  admin: '/admin',
  adminDashboard: '/admin/dashboard',

  adminCountries: '/admin/countries',
  adminCountryNew: '/admin/countries/new',
  adminCountryEdit: (id: string) => `/admin/countries/${id}/edit`,

  adminTowns: '/admin/towns',
  adminTownNew: '/admin/towns/new',
  adminTownEdit: (id: string) => `/admin/towns/${id}/edit`,

  adminActivities: '/admin/activities',
  adminActivityNew: '/admin/activities/new',
  adminActivityEdit: (id: string) => `/admin/activities/${id}/edit`,

  adminBlog: '/admin/blog',
  adminBlogNew: '/admin/blog/new',
  adminBlogEdit: (id: string) => `/admin/blog/${id}/edit`,
} as const

export const routePatterns = {
  countryDetail: '/countries/:countrySlug',
  townDetail: '/countries/:countrySlug/towns/:townSlug',
  activityDetail: '/activities/:activitySlug',
  ticket: '/tickets/:ticketCode',
  blogPost: '/blog/:slug',

  adminCountryEdit: '/admin/countries/:id/edit',
  adminTownEdit: '/admin/towns/:id/edit',
  adminActivityEdit: '/admin/activities/:id/edit',
  adminBlogEdit: '/admin/blog/:id/edit',
} as const

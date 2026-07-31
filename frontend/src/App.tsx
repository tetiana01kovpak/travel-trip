import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import HomePage from '@/pages/HomePage'

const CountriesPage = lazy(() => import('@/pages/CountriesPage'))
const CountryDetailPage = lazy(() => import('@/pages/CountryDetailPage'))
const TownDetailPage = lazy(() => import('@/pages/TownDetailPage'))
const ActivitiesPage = lazy(() => import('@/pages/ActivitiesPage'))
const ActivityDetailPage = lazy(() => import('@/pages/ActivityDetailPage'))
const TicketPage = lazy(() => import('@/pages/TicketPage'))
const BlogListPage = lazy(() => import('@/pages/BlogListPage'))
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminCountriesPage = lazy(() => import('@/pages/admin/AdminCountriesPage'))
const AdminCountryFormPage = lazy(() => import('@/pages/admin/AdminCountryFormPage'))
const AdminTownsPage = lazy(() => import('@/pages/admin/AdminTownsPage'))
const AdminTownFormPage = lazy(() => import('@/pages/admin/AdminTownFormPage'))
const AdminActivitiesPage = lazy(() => import('@/pages/admin/AdminActivitiesPage'))
const AdminActivityFormPage = lazy(() => import('@/pages/admin/AdminActivityFormPage'))
const AdminBlogPostsPage = lazy(() => import('@/pages/admin/AdminBlogPostsPage'))
const AdminBlogPostFormPage = lazy(() => import('@/pages/admin/AdminBlogPostFormPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-lagoon-200 border-t-lagoon-600" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="countries" element={<CountriesPage />} />
          <Route path="countries/:countrySlug" element={<CountryDetailPage />} />
          <Route path="countries/:countrySlug/towns/:townSlug" element={<TownDetailPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="activities/:activitySlug" element={<ActivityDetailPage />} />
          <Route path="tickets/:ticketCode" element={<TicketPage />} />
          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />

            <Route path="countries" element={<AdminCountriesPage />} />
            <Route path="countries/new" element={<AdminCountryFormPage />} />
            <Route path="countries/:id/edit" element={<AdminCountryFormPage />} />

            <Route path="towns" element={<AdminTownsPage />} />
            <Route path="towns/new" element={<AdminTownFormPage />} />
            <Route path="towns/:id/edit" element={<AdminTownFormPage />} />

            <Route path="activities" element={<AdminActivitiesPage />} />
            <Route path="activities/new" element={<AdminActivityFormPage />} />
            <Route path="activities/:id/edit" element={<AdminActivityFormPage />} />

            <Route path="blog" element={<AdminBlogPostsPage />} />
            <Route path="blog/new" element={<AdminBlogPostFormPage />} />
            <Route path="blog/:id/edit" element={<AdminBlogPostFormPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

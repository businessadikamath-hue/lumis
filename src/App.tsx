// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { JournalProvider } from './context/JournalContext'
import { ErrorBoundary } from './components/ErrorBoundary'

// Auth screens
import SplashScreen     from './screens/Splash'
import WelcomeScreen    from './screens/Welcome'
import VerifyScreen     from './screens/Verify'
import ResetPassword    from './screens/ResetPassword'

// App screens
import OnboardingScreen from './screens/Onboarding'
import HomeScreen       from './screens/Home'
import CheckInScreen    from './screens/CheckIn'
import EntryDetail      from './screens/EntryDetail'
import InsightsScreen   from './screens/Insights'
import PromptLibrary    from './screens/PromptLibrary'
import HistoryScreen    from './screens/History'
import SettingsScreen   from './screens/Settings'
import ReflectionScreen from './screens/Reflection'

// ProtectedRoute: redirects to /welcome if user is not authenticated
// or if device is not trusted. Wrap every post-login route with this.
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const isTrusted = localStorage.getItem('lumis_device_trusted')

  if (loading) return null  // still checking session — render nothing

  if (!user || !isTrusted) {
    return <Navigate to="/welcome" replace />
  }

  return <>{children}</>
}

// AnimatedRoutes: required so AnimatePresence can detect route changes
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        { /* ── PUBLIC ROUTES (no auth required) ── */}
        <Route path="/"        element={<SplashScreen />}  />
        <Route path="/welcome"  element={<WelcomeScreen />} />
        <Route path="/verify"   element={<VerifyScreen />}  />
        <Route path="/reset-password" element={<ResetPassword />} />

        { /* ── PROTECTED ROUTES (auth + trusted device required) ── */}
        <Route path="/onboarding" element={
          <ProtectedRoute><OnboardingScreen /></ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute><HomeScreen /></ProtectedRoute>
        } />
        <Route path="/checkin" element={
          <ProtectedRoute><CheckInScreen /></ProtectedRoute>
        } />
        <Route path="/entry/:id" element={
          <ProtectedRoute><EntryDetail /></ProtectedRoute>
        } />
        <Route path="/insights" element={
          <ProtectedRoute><InsightsScreen /></ProtectedRoute>
        } />
        <Route path="/prompts" element={
          <ProtectedRoute><PromptLibrary /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><HistoryScreen /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsScreen /></ProtectedRoute>
        } />
        <Route path="/reflection/:type" element={
          <ProtectedRoute><ReflectionScreen /></ProtectedRoute>
        } />

        { /* ── FALLBACK: any unknown URL → splash ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <JournalProvider>
              <AnimatedRoutes />
            </JournalProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
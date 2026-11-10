import { Route, Routes, useLocation } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import FloatingActions from "./components/FloatingActions"
import ScrollProgress from "./components/ScrollProgress"
import ScrollToTop from "./components/ScrollToTop"
import RevealOnScroll from "./components/RevealOnScroll"
import PageMeta from "./components/PageMeta"

import Home from "./pages/Home"
import Destinations from "./pages/Destinations"
import DestinationDetail from "./pages/DestinationDetail"
import Tours from "./pages/Tours"
import Gallery from "./pages/Gallery"
import About from "./pages/About"
import Journal from "./pages/Journal"
import PostDetail from "./pages/PostDetail"
import Contact from "./pages/Contact"
import Booking from "./pages/Booking"
import Wishlist from "./pages/Wishlist"
import NotFound from "./pages/NotFound"

export default function App() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-night"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <ScrollToTop />
      <RevealOnScroll />
      <PageMeta />
      <Navbar />

      <main id="main-content" className="flex-1">
        <div key={pathname} className="page-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:slug" element={<PostDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  )
}

import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Guides from './pages/Guides';
import Tips from './pages/Tips.jsx';
import GuideDetail from './pages/GuideDetail';
import Sites from './pages/Sites';
import Offers from './pages/Offers';
import OfferDetail from './pages/OfferDetail';

function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Guides" element={<Guides />} />
          <Route path="/Tips" element={<Tips />} />
          <Route path="/Guides/:slug" element={<GuideDetail />} />
          <Route path="/Sites" element={<Sites />} />
          <Route path="/Offers" element={<Offers />} />
          <Route path="/Offers/:offerSlug" element={<OfferDetail />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
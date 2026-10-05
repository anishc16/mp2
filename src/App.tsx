import { Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { DetailPage } from './pages/DetailPage'
import { GalleryPage } from './pages/GalleryPage'
import { ListPage } from './pages/ListPage'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/pokemon/:id" element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="site-footer">
        <p>Data and artwork provided by <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a>.</p>
      </footer>
    </>
  )
}


import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import JourneyPage from './pages/journeyPage/JourneyPage';
import WhereToPage from './pages/WhereToPage';
import HomePage from './pages/HomePage/HomePage';
import SettingsPage from './pages/SettingsPage'
import NavigationPage from './pages/NaviagtionPage';
import ObserverPage from './pages/observerPage/ObserverPage';
//import ChatPage from './pages/ChatPage';



/* import HistoryPage from
import SettingsPage from
import ChatPage from
import VisualizationsPage from  */

const App: React.FC = () => {
  return (
    <>
 <Router basename={import.meta.env.BASE_URL}>
      <div className="app">
        {/* Global Navigation */}
        <header>
          <h1>GlowPath!</h1>
        </header>

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={< HomePage/>} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/where-to" element={<WhereToPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/navigation" element={<NavigationPage />} />
           
            <Route path="/observe/:id" element={<ObserverPage />} />
           {/*  <Route path="/history" element={<HistoryPage />} />
             <Route path="/chat" element={<ChatPage />} />
            <Route path="/visualizations" element={<VisualizationsPage />} /> */}
          </Routes>
        </main>



      </div>
    </Router>

    </>
  )
}


export default App;
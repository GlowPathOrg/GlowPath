
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import JourneyPage from './pages/journeyPage/JourneyPage';
import WhereToPage from './pages/WhereToPage';
import HomePage from './pages/HomePage/HomePage';

import ProfilePage from './pages/profilePage/ProfilePage';
import NavigationPage from './pages/NaviagtionPage';
import ObserverPage from './pages/observerPage/ObserverPage';
import VisualisationsPage from './pages/VisualisationsPage';
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

              <Route path="/profile" element={<ProfilePage />} />



            <Route path="/navigation" element={<NavigationPage />} />
            <Route path="/visualisations" element={<VisualisationsPage />} />
            <Route path="/observe/:id" element={<ObserverPage />} />

           {/*  <Route path="/history" element={<HistoryPage />} />
             <Route path="/chat" element={<ChatPage />} />
            */}
          </Routes>
        </main>



      </div>
    </Router>

    </>
  )
}


export default App;
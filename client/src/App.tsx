
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import JourneyPage from './pages/journeyPage/JourneyPage';
import WhereToPage from './pages/WhereToPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';



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
            <Route path="/" element={<Navigate to="/journey" />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/where-to" element={<WhereToPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/me" element={<ProfilePage />} />
           {/*  <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
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
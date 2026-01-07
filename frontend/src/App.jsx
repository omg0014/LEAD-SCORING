import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeadDetail from './pages/LeadDetail';

import RulesConfig from './pages/RulesConfig';

function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans antialiased">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/rules" element={<RulesConfig />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;

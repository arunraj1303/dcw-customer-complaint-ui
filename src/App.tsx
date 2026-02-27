import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './navigation/Login';
import CreateComplaint from './navigation/CreateCompliant';
import IssueIdentification from './navigation/IssueIdentification';
import FinalStatus from './navigation/FinalStatus';
import LandingPage from './navigation/LandingPage';

const App: React.FC = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <Routes>
        {/* First page will be Login */}
        <Route path="/" element={<Login />} />
         <Route path="/landing" element={<LandingPage />} />
        {/* After login, redirect to form */}
        <Route path="/complaint-create" element={<CreateComplaint />} />
        
        {/* Other routes */}
        <Route path="/issue-identified" element={<IssueIdentification />} />
       <Route path="/final-status" element={<FinalStatus />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
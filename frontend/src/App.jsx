import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <ProfilePage setCurrentPage={setCurrentPage} />;
      case 'home':
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="app">
        <Navbar setCurrentPage={setCurrentPage} />
        <main>{renderPage()}</main>
      </div>
    </AuthProvider>
  );
}

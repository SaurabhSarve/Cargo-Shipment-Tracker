import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Login from './components/Login';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Save user to localStorage
  const handleSetUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Provider store={store}>
      <Router>
        <Navbar bg="lightblue" variant="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/dashboard"><b>Shipment Tracker</b></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                {!user && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
                {!user && <Nav.Link as={Link} to="/signup">Signup</Nav.Link>}
                {user && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleLogout}
                    className="ms-3"
                  >
                    Logout
                  </Button>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/signup" element={<Signup setUser={handleSetUser} />} />
          <Route path="/login" element={<Login setUser={handleSetUser} />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />
         <Route
  path="/"
  element={
    user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
  }
/>

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

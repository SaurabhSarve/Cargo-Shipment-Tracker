import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // Clear previous session before attempting new login
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
      email,
      password,
    });

    // Save new session data
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user)); // Optional for consistency
    setUser(res.data.user);

    navigate('/dashboard');
  } catch (err) {
    alert(err.response?.data?.error || 'Login failed');
  }
};


  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col md={5} lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">Welcome Back 👋</h3>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </div>

                <p className="text-center text-muted">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-decoration-none">
                    Sign up
                  </Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

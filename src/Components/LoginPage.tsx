import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import Footer from './footer.tsx';
import {jwtDecode} from "jwt-decode";
import {toast} from "react-toastify";



function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Send login request to backend
            const response = await axios.post("https://localhost:7040/api/Auth/login", {
                email,
                password
            });
            if(response.data.isActive){
                const token = response.data.token;
                localStorage.setItem("token", token);
                navigate("/");
            }else {
                toast.error("Your account is not active");
            }


        } catch (error: any) {
            toast.error(error.response?.data || "Login failed");
        }
    };

    return (
        <div className="loginBackground">
            <div className="min-vh-100 text-light">
                <nav className="navbar bg-dark navbar-expand-lg navbar-dark">
                    <div className="container">
                        <Link to="/">
                            <img style={{ width: "11vw" }} src="/images/Logo.png" alt="Logo" />
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <ul className="navbar-nav align-items-center gap-3">
                                <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
                                <li className="nav-item"><a className="nav-link" href="#">Favourite</a></li>
                                <li className="nav-item"><a className="nav-link" href="#">Chef List</a></li>
                                <div className="d-flex gap-2">
                                    <select className="form-select form-select-sm bg-dark text-light border-secondary">
                                        <option>English (United States)</option>
                                    </select>
                                </div>
                                <li className="nav-item">
                                    <button className="btn btn-warning rounded-pill px-4">Get Started</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Login Section */}
                <div className="container my-5">
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-8">
                            <div className="card bg-light text-dark">
                                <div className="card-body p-0">
                                    <div className="row g-0">
                                        {/* Login Form */}
                                        <div className="col-md-6 p-4 p-md-5">
                                            <h4 className="mb-4">Sign In</h4>
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <label htmlFor="email" className="form-label small">Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="password" className="form-label small">Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-primary w-100 mb-3">
                                                    Sign In
                                                </button>
                                                <div className="text-center mt-3">
                                                    <small>
                                                        <a href="#" className="text-decoration-none">Forgot password?</a>
                                                    </small>
                                                </div>
                                            </form>
                                        </div>

                                        {/* Create Account Section */}
                                        <div className="col-md-6 bg-light p-4 p-md-5 border-start">
                                            <h4 className="mb-4">Create an account</h4>
                                            <ul className="list-unstyled mb-4">
                                                <li className="mb-2 small text-muted">✓ Save your favorite recipes</li>
                                                <li className="mb-2 small text-muted">✓ Comment on recipes to share your experience</li>
                                                <li className="mb-2 small text-muted">✓ Rate recipes you've tried</li>
                                                <li className="mb-2 small text-muted">✓ Share your own recipes with the community</li>
                                                <li className="mb-2 small text-muted">✓ Get personalized recipe recommendations</li>
                                            </ul>
                                            <button className="btn btn-dark w-100" onClick={() => navigate("/signup")}>
                                                Create an account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}

export default LoginPage;

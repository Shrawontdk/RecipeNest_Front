import {Clock, Facebook, Instagram, Star, Twitter} from 'lucide-react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faPhone} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getUserRole, isAuthenticated} from "../utilities/auth.ts";
import axios from "axios";
import {API_BASE_URL} from "../config/api.ts";


function RecipeCard({imagePath, title, chefName, averageRating, difficulty = "Easy"}) {
    return (
        <div className="card recipe-card h-100 overflow-hidden">
            <div className="position-relative">
                <button className="btn btn-light rounded-circle p-1 position-absolute top-0 end-0 m-2 z-1">
                    ❤️
                </button>
                <img
                    src={`${API_BASE_URL}${imagePath}`}
                    className="card-img-top object-fit-cover"
                    alt={title}
                    style={{height: "200px", width: "100%"}}
                />
            </div>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text text-muted">By {chefName}</p>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-1">
                        <Star size={14} className="text-warning" fill="currentColor"/>
                        <span className="text-warning small">{averageRating?.toFixed(2)}</span>
                    </div>
                    <small className="text-muted d-flex align-items-center gap-1">
                        <Clock size={14}/> {difficulty}
                    </small>
                </div>
            </div>
        </div>
    );
}

function LandingPage() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<any[]>([]);

    useEffect(() => {
        if (isAuthenticated()) {
            const role = getUserRole();
            if (role === "admin") navigate("/adminDashboard");
            else if (role === "chef") navigate("/chefDashboard");
            else navigate("/home");
        }
    }, [navigate]);

    useEffect(() => {
        fetchRecipes();
    }, []);
    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/recipes/all`);
            setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    const featuredRecipes = recipes.slice(0, 3);
    const latestRecipes = recipes.slice(-3);

    return (
        <div className="bg-dark text-light">
            {/* Hero Section */}
            <header className="hero-section">
                <nav className="navbar navbar-expand-lg navbar-dark position-absolute w-100 z-1">
                    <div className="container">
                        <img style={{width: '15vw'}} src='src/assets/images/Logo.png' alt="Logo"/>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <ul className="navbar-nav align-items-center gap-3">
                                <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
                                <li className="nav-item"><a className="nav-link" href="#">Favourite</a></li>
                                <li className="nav-item"><a className="nav-link" href="#">Chef List</a></li>
                                <li className="nav-item">
                                    <button className="btn btn-warning rounded-pill px-4"
                                            onClick={() => navigate("/login")}>Get Started
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container h-100 position-relative">
                    <div className="row h-100 align-items-center">
                        <div className="col-md-8 col-lg-6">
                            <h1 className="display-3 fw-bold mb-4">BE THE CHEF OF YOUR KITCHEN</h1>
                            <p className="fs-4 mb-4">From Breakfast to Dinner, We Have You Covered</p>
                            <button className="btn btn-warning btn-lg rounded-pill px-5"
                                    onClick={() => navigate("/login")}>Get Cooking Now
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="background">
                {/* Featured Recipes */}
                <section className="py-5">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="fs-1">Browse our featured recipes</h2>
                            <button className="btn btn-outline-warning rounded-pill">Discover more</button>
                        </div>
                        <div className="row g-4">
                            {featuredRecipes.map((recipe, idx) => (
                                <div className="col-md-6 col-lg-4" key={idx}>
                                    <RecipeCard {...recipe}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Latest Recipes */}
                <section className="py-5">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="fs-1">Browse our latest recipes</h2>
                            <button className="btn btn-outline-warning rounded-pill">Discover more</button>
                        </div>
                        <div className="row g-4">
                            {latestRecipes.map((recipe, idx) => (
                                <div className="col-md-6 col-lg-4" key={idx}>
                                    <RecipeCard {...recipe}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-5">
                    <div className="container">
                        <div className="row align-items-center g-5">
                            <div className="col-lg-6">
                                <img
                                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Chef"
                                    className="img-fluid rounded"
                                />
                            </div>
                            <div className="col-lg-6">
                                <h2 className="fs-1 mb-4">About Us</h2>
                                <p className="text-light mb-4">
                                    Welcome to RecipeNest! Our mission is to empower chefs and food enthusiasts by
                                    providing
                                    a platform that allows users to share their recipes, try new ones, and build a
                                    community
                                    around the love of food. We aim to make cooking more enjoyable, accessible, and
                                    inclusive
                                    for everyone, no matter their culinary skill level.
                                </p>
                                <button className="btn btn-warning rounded-pill px-4 py-2">
                                    Learn more
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="py-5 border-top border-secondary">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-3">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <img style={{width: '10vw'}} src='src\assets\images\Logo.png'></img>
                            </div>
                            <p className="text-light" style={{textAlign: "justify"}}>
                                Recipenest is a comprehensive recipe platform where users can search, save, and share
                                their favorite recipes, and explore a variety of dishes from top chefs. It's your
                                one-stop destination for culinary inspiration and meal planning.
                                Discover the joy of cooking with our community of food lovers.
                            </p>
                        </div>
                        <div className="col-lg-3">
                            <h5 className="mb-3">Contact Us</h5>
                            <ul className="list-unstyled text-light">
                                <li>
                                    <FontAwesomeIcon icon={faEnvelope} className="me-2"/> shrawon@gmail.com
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faPhone} className="me-2"/> +(977) 9393942032
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h5 className="mb-3">Follow Us</h5>
                            <div className="d-flex gap-3">
                                <Facebook className="text-light"/>
                                <Instagram className="text-light"/>
                                <Twitter className="text-light"/>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <h5 className="mb-3">Navigation</h5>
                            <ul className="list-unstyled">
                                <li><a href="#" className="text-light text-decoration-none">Home</a></li>
                                <li><a href="#" className="text-light text-decoration-none">Recipes</a></li>
                                <li><a href="#" className="text-light text-decoration-none">About</a></li>
                                <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-light pt-4 mt-4 border-top border-secondary">
                        <p>Copyright © 2024 RecipeNest | All rights reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;

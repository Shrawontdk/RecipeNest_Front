import { Search, User } from "lucide-react";
import { useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { getUserRole } from "../utilities/auth.ts";
import Logo from "../assets/images/Logo.png";
import { motion } from "framer-motion";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token"); // assuming you're storing JWT here
        navigate("/"); // redirect to signin page
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const role = getUserRole();

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <motion.button
                className="btn btn-outline-light float-start"
                style={{ marginLeft: '1rem' }}
                onClick={() => {
                    // Add optional delay or visual feedback before navigating
                    navigate(-1);
                }}
                whileTap={{ scale: 0.9, rotate: -10 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                ←
            </motion.button>
            <div className="container">

                <Link to="/">
                    <img style={{ width: "11vw" }}  src={Logo} alt="Logo" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav mx-auto">


                        {role === "user" && (
                            <>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === "/home" ? "active" : ""}`} to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === "/favourite" ? "active" : ""}`} to="/favourite">Favourite</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === "/viewChefs" ? "active" : ""}`} to="/viewChefs">View Chefs</Link>
                                </li>
                            </>
                        )}

                        {role === "chef" && (
                            <>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === "/chefDashboard" ? "active" : ""}`}
                                          to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === "/myRecipes" ? "active" : ""}`}
                                          to="/myRecipes">My Recipes</Link>
                                </li>
                            </>
                        )}

                        {role === "admin" && (
                            <>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === "/adminDashboard" ? "active" : ""}`} to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === "/userList" ? "active" : ""}`} to="/userList">User List</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === "/chefList" ? "active" : ""}`} to="/chefList">Chef List</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-3 position-relative">

                        <select className="form-select form-select-sm bg-dark text-light border-secondary">
                            <option>English (United States)</option>
                        </select>

                        <button className="btn btn-dark">
                            <Search size={20} />
                        </button>

                        <div className="dropdown">
                            <button
                                className="btn btn-dark dropdown-toggle"
                                onClick={toggleDropdown}
                            >
                                <User size={20} />
                            </button>

                            <ul
                                className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`}
                                style={{ position: "absolute", right: 0 }}
                            >
                                <li>
                                    <button className="dropdown-item" onClick={() => navigate('/profile')}>View Profile</button>
                                </li>
                                <li>
                                    <button className="dropdown-item">Change Password</button>
                                </li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import Footer from "./footer.tsx";
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import {toast} from "react-toastify";
import {API_BASE_URL} from "../config/api.ts";


type FormData = {
    name: string;
    role: string;
    email: string;
    dob: string;
    password: string;
    confirmPassword: string;
    country: string;
    phone: string;
    terms: boolean;
};

const Signup = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        role: "",
        email: "",
        dob: "",
        password: "",
        confirmPassword: "",
        country: "",
        phone: "",
        terms: false
    });


    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        const newValue = type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value;

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };


    const validate = () => {
        const newErrors: Partial<FormData> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.role.trim()) newErrors.role = "Role is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.terms) newErrors.terms = "You must agree to the terms";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await axios.post(`${API_BASE_URL}/api/signup`, {
                name: formData.name,
                role: formData.role,
                email: formData.email,
                dob: formData.dob,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                country: formData.country,
                phone: formData.phone
            });

            toast.success("Account created successfully!");
            navigate('/login');

        } catch (error: any) {
            console.error("Signup error:", error);
            toast.error(error.response?.data || "Signup failed");
        }
    };


    return (
        <div className='loginBackground'>
            <div className="min-vh-100 ">
                {/* Navigation */}
                <nav className="navbar bg-dark navbar-expand-lg navbar-dark ">
                    <div className="container">
                        <Link to="/">
                            <img style={{width: "11vw"}} src="src/assets/images/Logo.png" alt="Logo"/>
                        </Link>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <ul className="navbar-nav align-items-center gap-3">
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Favourite</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Chef List</a>
                                </li>
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

                {/* Main Content */}
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card bg-white shadow-lg">
                                <div className="card-body p-4">
                                    <h4 className="mb-1">Create account</h4>
                                    <p className="text-muted small mb-4">Be the chef of your kitchen</p>

                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Role</label>
                                                <select
                                                    name="role"
                                                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select a role</option>
                                                    <option value="user">Food Lover</option>
                                                    <option value="chef">Chef</option>
                                                </select>

                                                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Date of birth (MM/DD/YY)</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                                                    value={formData.dob}
                                                    onChange={handleChange}
                                                />
                                                {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Password</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                    <span
                                                        className="input-group-text"
                                                        style={{cursor: "pointer"}}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                                                    </span>
                                                </div>
                                                {errors.password &&
                                                    <div className="invalid-feedback d-block">{errors.password}</div>}
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Confirm Password</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                    />
                                                    <span
                                                        className="input-group-text"
                                                        style={{cursor: "pointer"}}
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye}/>
            </span>
                                                </div>
                                                {errors.confirmPassword && <div
                                                    className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Country</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                />
                                                {errors.country &&
                                                    <div className="invalid-feedback">{errors.country}</div>}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    name="terms"
                                                    className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                                                    id="terms"
                                                    checked={formData.terms}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label small" htmlFor="terms">
                                                    I agree to RecipeNest's <span
                                                    className="text-primary">Terms</span> and <span
                                                    className="text-primary">Privacy Policy</span>
                                                </label>
                                                {errors.terms &&
                                                    <div className="invalid-feedback d-block">{errors.terms}</div>}
                                            </div>
                                        </div>

                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-primary">Create account</button>
                                        </div>

                                        <div className="text-center mt-3">
                                            <small className="text-muted">
                                                Already have an account? <Link to="/login"
                                                                               className="text-decoration-none">Log
                                                in</Link>
                                            </small>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
};

export default Signup;

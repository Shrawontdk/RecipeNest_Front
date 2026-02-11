import React, {useEffect, useState} from "react";
import {ChefHat, TrendingUp, User} from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {MdOutlineRateReview} from "react-icons/md";
import {BiCookie} from "react-icons/bi";
import {getUserId} from "../utilities/auth.ts";
import {API_BASE_URL} from "../config/api.ts";

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalChefs: 0,
        totalRecipes: 0,
        totalReview: 0,
    });
    const [reviews, setReviews] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = getUserId();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchDashboardStats(), fetchReviews()]);
            } catch (err) {
                setError("Failed to load dashboard data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchAdminData();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard-stats`);
            setStats(response.data);
        } catch (err) {
            console.error("Failed to load stats:", err);
            throw err;
        }
    };
    const fetchAdminData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setAdminData(response.data);
        } catch (err) {
            console.error("Failed to load stats:", err);
            throw err;
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/review`);
            const filteredReviews = response.data
                .filter(review => review && review.user && review.recipe)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);
            setReviews(filteredReviews);
        } catch (err) {
            console.error("Failed to load reviews:", err);
            throw err;
        }
    };

    const pieData = [
        {name: "Users", value: stats.totalUsers},
        {name: "Chefs", value: stats.totalChefs},
        {name: "Recipes", value: stats.totalRecipes},
    ];

    const COLORS = ["#FF6384", "#36A2EB", "#4BC0C0", "#FFCE56"];

    const barData = [
        {name: "Users", value: stats.totalUsers},
        {name: "Chefs", value: stats.totalChefs},
        {name: "Recipes", value: stats.totalRecipes},
        {name: "Reviews", value: stats.totalReview},
    ];

    // Format timestamps
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="background min-vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="background min-vh-100">
                <Navbar/>
                <div className="container py-4">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="background min-vh-100">
            <Navbar/>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex gap-3">
                        <img
                            src={adminData.profileImageUrl ? `${API_BASE_URL}${adminData.profileImageUrl}` : "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"}
                            alt="Chef Gordon"
                            className="rounded-circle" style={{width: "80px", height: "80px", objectFit: "cover"}}
                        />
                        <div>
                            <h3 className="text-light mb-1">Welcome, Admin</h3>
                            <p className="text-light mb-0">Dashboard Overview • {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button className="btn btn-light" onClick={() => {
                        fetchDashboardStats();
                        fetchReviews();
                    }}>
                        <TrendingUp size={16} className="me-2"/>
                        Refresh Data
                    </button>
                </div>

                <div className="row g-4 my-3">
                    {[
                        {
                            label: "Total Users",
                            value: stats.totalUsers,
                            icon: <User size={24}/>,
                            bg: "warning",
                            userStat: stats.totalUsers
                        },
                        {
                            label: "Total Chefs",
                            value: stats.totalChefs,
                            icon: <ChefHat size={24}/>,
                            bg: "primary",
                            userStat: stats.totalChefs
                        },
                        {
                            label: "Total Recipes",
                            value: stats.totalRecipes,
                            icon: <BiCookie size={24}/>,
                            bg: "success",
                            userStat: stats.totalRecipes
                        },
                        {
                            label: "Total Reviews",
                            value: stats.totalReview,
                            icon: <MdOutlineRateReview size={24}/>,
                            bg: "danger", userStat: stats.totalReview
                        },
                    ].map((card, i) => (
                        <div key={i} className="col-md-3">
                            <div className="card bg-white border-0 rounded-4 h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className={`bg-${card.bg} rounded-circle p-2`}>
                                            {React.cloneElement(card.icon, {className: "text-white"})}
                                        </div>
                                        <h4 className="text-muted">{card.label}</h4>
                                    </div>
                                    <h3 className="mb-0 text-dark">{card.value}</h3>
                                    <div className="progress" style={{height: 6}}>
                                        <div
                                            className="progress-bar bg-primary"
                                            style={{width: `${card?.userStat > 0 ? Math.min(card?.userStat, 100) : 0}%`}}
                                        ></div>
                                    </div>
                                    <small className="text-muted">Live Count</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-6">
                        <div className="card bg-white border-0 rounded-4 shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title mb-4">User Distribution</h5>
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                            ))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36}/>
                                        <Tooltip formatter={(value) => [value, 'Count']}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card bg-white border-0 rounded-4 shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title mb-4">Growth Overview</h5>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={barData} margin={{top: 5, right: 20, left: 0, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <Tooltip
                                            contentStyle={{borderRadius: "8px"}}
                                            formatter={(value) => [value.toLocaleString(), 'Count']}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[4, 4, 0, 0]}
                                            background={{fill: "#f5f5f5"}}
                                        >
                                            {barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col">
                        <div className="card bg-white border-0 rounded-4 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="card-title mb-0">Recent Reviews</h5>
                                    <button className="btn btn-sm btn-outline-secondary"
                                            onClick={fetchReviews}>Refresh
                                    </button>
                                </div>

                                {reviews.length === 0 ? (
                                    <div className="text-center p-4">
                                        <p className="text-muted mb-0">No reviews found</p>
                                    </div>
                                ) : (
                                    <div className="list-group">
                                        {reviews.map((review: any, i) => (
                                            <div key={i} className="list-group-item border-0 mb-3 rounded-3 shadow">
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 me-3">
                                                        {review.recipe.imagePath && (
                                                            <img
                                                                src={API_BASE_URL + review.recipe.imagePath}
                                                                alt={review.recipe.title}
                                                                className="rounded-3"
                                                                style={{
                                                                    width: "80px",
                                                                    height: "80px",
                                                                    objectFit: "cover"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div
                                                            className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <h6 className="mb-1 fw-bold">{review.user.name}</h6>
                                                                <p className="mb-1">
                                                                    <span
                                                                        className="fw-medium">{review.recipe.title}</span>
                                                                    {review.comment && (
                                                                        <span
                                                                            className="text-muted"> - {review.comment}</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="d-flex flex-column align-items-end">
                                                                <div className="rating mb-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <span key={i}
                                                                              className={`me-1 ${i < review.rating ? "text-warning" : "text-muted"}`}>★</span>
                                                                    ))}
                                                                </div>
                                                                <small className="text-muted">
                                                                    {formatDate(review.createdAt)}
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mt-2">
                              <span className="badge bg-light text-dark me-2">
                                {review.recipe.cuisine}
                              </span>
                                                            <span className="badge bg-light text-dark">
                                {review.recipe.collection}
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="text-center mt-3">
                                    <a href="/admin/reviews" className="btn btn-outline-primary">View All Reviews</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;

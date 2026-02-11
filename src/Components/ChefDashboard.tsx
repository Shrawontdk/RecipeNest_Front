import {useEffect, useState} from 'react';
import {Edit, Plus, Star, Trash2} from 'lucide-react';
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import {getUserId} from "../utilities/auth.ts";
import Navbar from "./Navbar.tsx";
import {toast} from "react-toastify";
import {BiCookie} from "react-icons/bi";
import {AiOutlineComment} from "react-icons/ai";
import {MdOutlineRateReview} from "react-icons/md";
import {GrView} from "react-icons/gr";
import {API_BASE_URL} from "../config/api.ts";

function ChefDashboard() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<any[]>([]); // Make sure it's an array
    const totalEngagement = recipes.reduce((sum, recipe) => sum + (recipe.reviewCount || 0), 0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = getUserId();
    const [averageRating, setAverageRating] = useState<number>(0);
    const [userName, setUserName] = useState<string | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        if (userId) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/api/Recipes/createdby/${userId}`)
                .then(response => {
                    if (response) {
                        const data = response.data;
                        setAverageRating(data.averageRating);
                        setUserName(data.userName);
                        setProfileImageUrl(data.profileImageUrl);
                        if (Array.isArray(data.recipes)) {
                            setRecipes(data.recipes);
                        } else {
                            setRecipes([]); // fallback to empty array
                            console.error('Expected an array but got:', data);
                        }
                        setLoading(false);
                    }
                })
                .catch(error => {
                    console.error('Error fetching recipes:', error);
                    setError('Failed to load recipes');
                    setLoading(false);
                });
        } else {
            setError('User not authenticated');
            setLoading(false);
        }
    }

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/Recipes/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            fetchData();
            toast.success("Recipe deleted successfully!");
        } catch (error) {
            console.error("Error deleting recipe:", error);
            toast.error("Failed to delete the recipe.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className='background'>
            <div className="min-vh-100">
                {/* Navbar */}
                <Navbar/>

                {/* Main Content */}
                <div className="container py-4">
                    {/* Profile Header */}
                    <div className="card bg-light mb-4">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <img
                                    src={profileImageUrl ? `${API_BASE_URL}${profileImageUrl}` : "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"}
                                    alt="Chef Gordon"
                                    className="rounded-circle"
                                    style={{width: "70px", height: "70px", objectFit: "cover"}}
                                />
                                <div>
                                    <h4 className="mb-0">Welcome {userName}</h4>
                                    <small className="text-muted">Manage your recipes and profile</small>
                                </div>
                            </div>
                            <button className="btn btn-danger" onClick={() => navigate("/createRecipe")}>
                                <Plus size={20} className="me-2"/>
                                Add New Recipe
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body d-flex align-items-center gap-3">
                                    <div className="bg-success bg-opacity-10 p-3 rounded">
                                        <BiCookie size={24} className="text-success"/>
                                    </div>
                                    <div>
                                        <h3 className="mb-0">{recipes.length}</h3>
                                        <small className="text-muted">Total Recipes</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body d-flex align-items-center gap-3">
                                    <div className="bg-danger bg-opacity-10 p-3 rounded">
                                        <MdOutlineRateReview size={24} className="text-danger"/>
                                    </div>
                                    <div>
                                        <h3 className="mb-0">{totalEngagement}</h3>
                                        <small className="text-muted">Total Engagement</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body d-flex align-items-center gap-3">
                                    <div className="bg-warning bg-opacity-10 p-3 rounded">
                                        <Star size={24} className="text-warning"/>
                                    </div>
                                    <div>
                                        <h3 className="mb-0">{averageRating?.toFixed(2)}</h3>
                                        <small className="text-muted">Avg Rating</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recipes Table */}
                    <div className="card bg-light mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">Your Recipes</h5>
                                <Link to="/myRecipes" className="text-decoration-none">View All</Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>Recipe Name</th>
                                        <th>Category</th>
                                        <th>Date Added</th>
                                        <th>Engagement</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recipes.length > 0 ? (
                                        recipes.slice(0, 5).map((recipe: any) => (
                                            <tr key={recipe.id}>
                                                <td>{recipe.title}</td>
                                                <td>
                                                <span className="badge bg-info bg-opacity-10 text-info">
                                                  {recipe.cuisine}
                                                </span>
                                                </td>
                                                <td>{new Date(recipe.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-2">
                                                            <span
                                                                className="badge bg-success rounded-pill">{recipe.reviewCount}</span>
                                                        </div>
                                                        <div className="progress flex-grow-1"
                                                             style={{height: '6px', width: '60px'}}>
                                                            <div
                                                                className="progress-bar bg-success"
                                                                role="progressbar"
                                                                style={{width: `${Math.min(recipe.reviewCount * 10, 100)}%`}}
                                                                aria-valuenow={recipe.reviewCount}
                                                                aria-valuemin="0"
                                                                aria-valuemax="10"
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="text-end pe-4 ml-5">
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-outline-primary"
                                                                onClick={() => navigate(`/recipeDetails/${recipe.id}`)}>
                                                            <GrView size={16}/>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-primary"
                                                                onClick={() => navigate(`/createRecipe/${recipe.id}`)}>
                                                            <Edit size={16}/>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(recipe.id)}>
                                                            <Trash2 size={16}/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center">No recipes found</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card bg-light">
                        <div className="card-body">
                            <h5 className="mb-4">Recent Activity</h5>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-danger bg-opacity-10 p-2 rounded">
                                        <AiOutlineComment size={20} className="text-danger"/>
                                    </div>
                                    <div>
                                        <p className="mb-0">Your recipe "Italian Pasta" received a new
                                            comment</p>
                                        <small className="text-muted">2 hours ago</small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-warning bg-opacity-10 p-2 rounded">
                                        <Star size={20} className="text-warning"/>
                                    </div>
                                    <div>
                                        <p className="mb-0">New rating on "Basic Korean Spicy Ramen"</p>
                                        <small className="text-muted">5 hours ago</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ChefDashboard;

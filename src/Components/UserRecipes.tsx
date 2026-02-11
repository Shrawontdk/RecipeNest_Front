import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {Award, Bookmark, Calendar, ChefHat, Clock, Grid, List, Share2, Star, User} from 'lucide-react';
import Navbar from './Navbar';
import {API_BASE_URL} from "../config/api.ts";


function RecipeCard({id, imagePath, title, cookingTime, averageRating, description = "", cuisine, createdAt}) {
    const navigate = useNavigate();
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="card h-100 border-0 shadow-sm hover-shadow transition-all rounded-4 overflow-hidden">
            <div className="position-relative">
                <img
                    src={`${API_BASE_URL}${imagePath}` || "/api/placeholder/400/200"}
                    className="card-img-top"
                    style={{height: '180px', objectFit: 'cover'}}
                    alt={title}
                />
                <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-dark bg-opacity-75 rounded-pill px-2 py-1">
                        <Star size={12} className="text-warning me-1" fill="currentColor"/>
                        <span className="text-white">{averageRating?.toFixed(1) || "N/A"}</span>
                    </span>
                </div>
                {cuisine && (
                    <div className="position-absolute bottom-0 start-0 p-2">
                        <span className="badge bg-primary bg-opacity-75 rounded-pill px-3 py-1">
                            {cuisine}
                        </span>
                    </div>
                )}
            </div>
            <div className="card-body p-3">
                <h5 className="card-title fw-bold mb-2 text-truncate">{title}</h5>
                <div className="d-flex align-items-center mb-2 text-muted small">
                    <Clock size={14} className="me-1"/>
                    <span>{cookingTime || 'N/A'}</span>
                    <span className="mx-2">•</span>
                    <Calendar size={14} className="me-1"/>
                    <span>{formattedDate}</span>
                </div>
                <p className="card-text text-muted small mb-3" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    height: '40px'
                }}>
                    {description || "No description available."}
                </p>

                <button
                    className="btn btn-warning w-100 rounded-3"
                    onClick={() => navigate(`/recipeDetails/${id}`)}
                >
                    View Recipe
                </button>
            </div>
        </div>
    );
}

const UserRecipes = () => {
    const {id} = useParams();
    const [recipes, setRecipes] = useState([]);
    const [userName, setUserName] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('newest');
    const [recipesCount, setRecipesCount] = useState(0);
    const [filterCuisine, setFilterCuisine] = useState('');
    const [cuisines, setCuisines] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/Recipes/createdby/${id}`);
                const recipesData = response.data.recipes || [];
                setRecipes(recipesData);
                setUserName(response.data.userName);
                setAverageRating(response.data.averageRating);
                setProfileImageUrl(response.data.profileImageUrl);
                setRecipesCount(recipesData.length);

                // Extract unique cuisines
                if (recipesData.length > 0) {
                    const uniqueCuisines = [...new Set(recipesData.map(recipe => recipe.cuisine).filter(Boolean))];
                    setCuisines(uniqueCuisines);
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [id]);

    const handleSort = (value) => {
        setSortBy(value);
        let sortedRecipes = [...recipes];

        switch (value) {
            case 'newest':
                sortedRecipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                sortedRecipes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'rating-high':
                sortedRecipes.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case 'rating-low':
                sortedRecipes.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
                break;
            default:
                break;
        }

        setRecipes(sortedRecipes);
    };

    const filteredRecipes = filterCuisine
        ? recipes.filter(recipe => recipe.cuisine === filterCuisine)
        : recipes;

    if (loading) {
        return (
            <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading chef's recipes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light background min-vh-100">
            <Navbar/>

            {/* Chef Profile Header */}
            <div className=" text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-2 text-center text-md-start mb-4 mb-md-0">
                            <div className="position-relative d-inline-block">
                                <img
                                    src={profileImageUrl ? `${API_BASE_URL}${profileImageUrl}` : "/api/placeholder/200/200"}
                                    alt={userName}
                                    className="rounded-circle img-thumbnail border-3 shadow"
                                    style={{width: "180px", height: "180px", objectFit: "cover"}}
                                />
                                {averageRating > 4.5 && (
                                    <div className="position-absolute bottom-0 end-0">
                                        <span className="badge rounded-circle bg-warning p-2" title="Top Chef">
                                            <Award size={20}/>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-10">
                            <div
                                className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                <div>
                                    <div className="d-flex align-items-center mb-2">
                                        <ChefHat size={28} className="me-2 text-warning"/>
                                        <h1 className="display-5 mb-0 fw-bold">{userName}</h1>
                                    </div>
                                    <div className="d-flex flex-wrap gap-4 mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="me-2 rounded-circle bg-white bg-opacity-25 p-2">
                                                <Star fill="currentColor" size={16} className="text-warning"/>
                                            </div>
                                            <div>
                                                <div className="fw-bold">{averageRating?.toFixed(1) || "0.0"}</div>
                                                <div className="small text-white text-opacity-75">Avg. Rating</div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2 rounded-circle bg-white bg-opacity-25 p-2">
                                                <User size={16}/>
                                            </div>
                                            <div>
                                                <div className="fw-bold">{recipesCount}</div>
                                                <div className="small text-white text-opacity-75">Recipes</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2 mt-3 mt-md-0">
                                    <button className="btn btn-sm btn-light rounded-pill">
                                        <Bookmark size={16} className="me-1"/>
                                        <span>Follow</span>
                                    </button>
                                    <button className="btn btn-sm btn-light rounded-pill">
                                        <Share2 size={16} className="me-1"/>
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipes Section */}
            <section className="py-5">
                <div className="container">
                    {/* Filters and Controls */}
                    <div className="card shadow-sm border-0 rounded-4 mb-4">
                        <div className="card-body p-3">
                            <div className="row align-items-center">
                                <div className="col-lg-3 mb-3 mb-lg-0">
                                    <h5 className="mb-0">Recipes ({filteredRecipes.length})</h5>
                                </div>
                                <div className="col-lg-9">
                                    <div className="d-flex flex-wrap gap-3 justify-content-lg-end">
                                        {cuisines.length > 0 && (
                                            <select
                                                className="form-select form-select-sm"
                                                style={{width: 'auto'}}
                                                value={filterCuisine}
                                                onChange={(e) => setFilterCuisine(e.target.value)}
                                            >
                                                <option value="">All Cuisines</option>
                                                {cuisines.map((cuisine, index) => (
                                                    <option key={index} value={cuisine}>{cuisine}</option>
                                                ))}
                                            </select>
                                        )}

                                        <select
                                            className="form-select form-select-sm"
                                            style={{width: 'auto'}}
                                            value={sortBy}
                                            onChange={(e) => handleSort(e.target.value)}
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="rating-high">Highest Rated</option>
                                            <option value="rating-low">Lowest Rated</option>
                                        </select>

                                        <div className="btn-group" role="group">
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setViewMode('grid')}
                                            >
                                                <Grid size={16}/>
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setViewMode('list')}
                                            >
                                                <List size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recipe Cards */}
                    {filteredRecipes.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="row g-4">
                                {filteredRecipes.map((recipe: any, index) => (
                                    <div key={recipe.id || index} className="col-sm-6 col-lg-3">
                                        <RecipeCard {...recipe} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="row g-4">
                                {filteredRecipes.map((recipe: any, index) => (
                                    <div key={recipe.id || index} className="col-12">
                                        <div
                                            className="card border-0 shadow-sm hover-shadow transition-all rounded-4 overflow-hidden">
                                            <div className="row g-0">
                                                <div className="col-md-3">
                                                    <img
                                                        src={`${API_BASE_URL}${recipe.imagePath}` || "/api/placeholder/400/400"}
                                                        className="img-fluid rounded-start"
                                                        style={{height: '100%', width: '100%', objectFit: 'cover'}}
                                                        alt={recipe.title}
                                                    />
                                                </div>
                                                <div className="col-md-9">
                                                    <div className="card-body p-4">
                                                        <div
                                                            className="d-flex justify-content-between align-items-start mb-2">
                                                            <h4 className="card-title">{recipe.title}</h4>
                                                            <div className="d-flex align-items-center">
                                                                <Star size={16} className="text-warning me-1"
                                                                      fill="currentColor"/>
                                                                <span
                                                                    className="text-warning">{recipe.averageRating?.toFixed(1) || "N/A"}</span>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex gap-3 mb-3">
                                                            <div className="d-flex align-items-center">
                                                                <Clock size={16} className="text-muted me-1"/>
                                                                <span
                                                                    className="text-muted">{recipe.cookingTime || 'N/A'}</span>
                                                            </div>
                                                            {recipe.cuisine && (
                                                                <span
                                                                    className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                                                                    {recipe.cuisine}
                                                                </span>
                                                            )}
                                                            <small className="text-muted">
                                                                Created: {new Date(recipe.createdAt).toLocaleDateString()}
                                                            </small>
                                                        </div>

                                                        <p className="card-text mb-3">{recipe.description || "No description available."}</p>

                                                        <button
                                                            className="btn btn-warning"
                                                            onClick={() => navigate(`/recipeDetails/${recipe.id}`)}
                                                        >
                                                            View Recipe
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-5 text-light">
                            <div className="mb-4 ">
                                <img
                                    src="/api/placeholder/150/150"
                                    alt="No recipes"
                                    className="img-fluid text-warning opacity-50"
                                />
                            </div>
                            <h4>No recipes found</h4>
                            <p className="text-light">
                                {filterCuisine
                                    ? `No ${filterCuisine} recipes available from this chef`
                                    : "This chef hasn't shared any recipes yet"}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default UserRecipes;

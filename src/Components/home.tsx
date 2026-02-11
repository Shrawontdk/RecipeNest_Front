import React, {useEffect, useState} from 'react';
import {Calendar, Clock, Filter, Heart, Star, X} from 'lucide-react';
import Navbar from './Navbar.tsx';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";
import {getUserId} from "../utilities/auth.ts";
import {API_BASE_URL} from "../config/api.ts";


function RecipeCard({
                        id,
                        imagePath,
                        title,
                        cookingTime,
                        averageRating,
                        description = "",
                        onFavorite,
                        createdAt,
                        cuisine
                    }) {
    const navigate = useNavigate();
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="card h-100 border-0 rounded-4 overflow-hidden">
            <div className="position-relative">
                <img
                    src={`${API_BASE_URL}${imagePath}` || "/api/placeholder/400/200"}
                    className="card-img-top"
                    style={{height: '180px', objectFit: 'cover'}}
                    alt={title}
                />
                <div className="position-absolute top-0 end-0 p-2 d-flex flex-column gap-2">
                    <button
                        className="btn btn-light rounded-circle p-2"
                        onClick={() => onFavorite(id)}
                        title="Add to Favorites"
                    >
                        <Heart size={16}/>
                    </button>
                </div>
                {cuisine && (
                    <div className="position-absolute bottom-0 start-0 p-2">
                        <span className="badge bg-primary bg-opacity-75 rounded-pill px-3 py-1">
                            {cuisine}
                        </span>
                    </div>
                )}
            </div>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{title}</h5>
                    <div className="d-flex align-items-center gap-1">
                        <Star size={14} className="text-warning" fill="currentColor"/>
                        <span className="text-warning small">{averageRating?.toFixed(2)}</span>
                    </div>
                </div>
                <div className="d-flex align-items-center mb-2 text-muted small">
                    <Clock size={14} className="me-1"/>
                    <span>{cookingTime || 'N/A'}</span>
                    <span className="mx-2">•</span>
                    <Calendar size={14} className="me-1"/>
                    <span>{formattedDate}</span>
                </div>
                <p className="card-text text-muted small mb-3 clamp-description" title={description}>
                    {description}
                </p>
                <button className="view-recipe-btn" onClick={() => navigate(`/recipeDetails/${id}`)}>
                    <span className="view-recipe-shadow"></span>
                    <span className="view-recipe-edge"></span>
                    <span className="view-recipe-front">View Recipe</span>
                </button>

            </div>
        </div>
    );
}

function TrendingRecipe({title, chefName, image}) {
    return (
        <div className="position-relative h-100">
            <img
                src={image}
                className="w-100 h-100"
                style={{objectFit: 'cover'}}
                alt={title}
            />
            <div
                className="position-absolute bottom-0 start-0 w-100 p-5"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    minHeight: '50%',
                }}
            >
                <h5 className="text-warning mb-2">Trending now</h5>
                <h2 className="display-4 fw-bold mb-2">{title}</h2>
                <p className="mb-4 fs-5">By {chefName}</p>
            </div>
        </div>
    );
}

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [userData, setUserData] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        cuisine: '',
        rating: '',
        cookingTime: ''
    });
    const [appliedFilters, setAppliedFilters] = useState([]);
    const userId = getUserId();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRecipes();
        fetchUserData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [recipes, filters]);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/recipes/all`);
            setRecipes(response.data);
            setFilteredRecipes(response.data);
            setTrendingRecipes(response.data.slice(-3)); // This gives last 3
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setUserData(response.data);
        } catch (err) {
            console.error("Failed to load stats:", err);
            throw err;
        }
    };

    const addToFavorite = async (recipeId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}/api/favorites/${recipeId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Recipe added to favorites!");
        } catch (error) {
            if (error.response?.status === 400) {
                toast.warning("Recipe is already in favorites.");
            } else {
                console.error("Error adding to favorites:", error);
                toast.error("Something went wrong.");
            }
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));

        // Update applied filters
        let newAppliedFilters: any = [...appliedFilters];

        // Remove existing filter of this type if any
        newAppliedFilters = newAppliedFilters.filter((f: any) => f.type !== filterType);

        // Add new filter if value is not empty
        if (value) {
            newAppliedFilters.push({
                type: filterType,
                value: value,
                label: `${filterType}: ${value}`
            });
        }

        setAppliedFilters(newAppliedFilters);
    };

    const removeFilter = (filterType) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: ''
        }));

        setAppliedFilters(prev => prev.filter(f => f.type !== filterType));
    };

    const clearAllFilters = () => {
        setFilters({
            cuisine: '',
            rating: '',
            cookingTime: ''
        });
        setAppliedFilters([]);
    };

    const applyFilters = () => {
        let result = [...recipes];

        if (filters.cuisine) {
            result = result.filter((recipe: any) => recipe.cuisine && recipe.cuisine.toLowerCase() === filters.cuisine.toLowerCase());
        }

        if (filters.rating) {
            const minRating = parseInt(filters.rating);
            result = result.filter((recipe: any) => recipe.averageRating >= minRating);
        }

        if (filters.cookingTime) {
            switch (filters.cookingTime) {
                case 'quick':
                    result = result.filter((recipe: any) => {
                        const time = recipe.cookingTime?.toLowerCase() || '';
                        return time.includes('min') && parseInt(time) <= 30;
                    });
                    break;
                case 'medium':
                    result = result.filter((recipe: any) => {
                        const time = recipe.cookingTime?.toLowerCase() || '';
                        return (time.includes('min') && parseInt(time) > 30 && parseInt(time) <= 60) ||
                            (time.includes('hr') && parseInt(time) === 1);
                    });
                    break;
                case 'long':
                    result = result.filter((recipe: any) => {
                        const time = recipe.cookingTime?.toLowerCase() || '';
                        return (time.includes('hr') && parseInt(time) > 1);
                    });
                    break;
                default:
                    break;
            }
        }

        setFilteredRecipes(result);
    };

    // Get unique cuisines from recipes
    const cuisines = [...new Set(recipes.filter(r => r.cuisine).map(r => r.cuisine))];

    return (
        <div className="bg-dark text-light">
            <div className="background">
                <Navbar/>
                <div className="container d-flex gap-3 my-3">
                    <img
                        src={userData.profileImageUrl ? `${API_BASE_URL}${userData.profileImageUrl}` : "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"}
                        alt="Chef Gordon"
                        className="rounded-circle" style={{width: "80px", height: "80px", objectFit: "cover"}}
                    />
                    <div>
                        <h3 className="text-light mb-1">Welcome, {userData.name}</h3>
                        <p className="text-light mb-0">Dashboard Overview • {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                {/* Trending Carousel */}
                <div id="trendingCarousel" className="carousel slide mt-4" data-bs-ride="carousel">
                    <div className="carousel-inner" style={{height: '55vh', width: "90%"}}>
                        {trendingRecipes.map((recipe, index) => (
                            <div key={recipe.id} className={`carousel-item ${index === 0 ? 'active' : ''} h-100`}>
                                <TrendingRecipe
                                    title={recipe.title}
                                    chefName={recipe.chefName || "Unknown Chef"}
                                    image={`${API_BASE_URL}${recipe.imagePath}`}
                                />
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#trendingCarousel"
                            data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#trendingCarousel"
                            data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                    <div className="carousel-indicators">
                        {trendingRecipes.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                data-bs-target="#trendingCarousel"
                                data-bs-slide-to={idx}
                                className={idx === 0 ? 'active' : ''}
                                aria-current={idx === 0 ? 'true' : undefined}
                                aria-label={`Slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Recommended Recipes */}
                <section className="py-5">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fs-1 mb-0 text-warning">Recommended Recipes</h2>
                            <div className="position-relative">
                                <button
                                    className="btn btn-outline-warning d-flex align-items-center gap-2"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter size={18}/>
                                    Filter
                                    {appliedFilters.length > 0 && (
                                        <span className="badge bg-warning text-dark ms-2">{appliedFilters.length}</span>
                                    )}
                                </button>

                                {showFilters && (
                                    <div
                                        className="position-absolute end-0 mt-2 p-3 bg-dark border border-warning rounded shadow-lg"
                                        style={{width: '300px', zIndex: 1000}}>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0 text-warning">Filters</h6>
                                            {appliedFilters.length > 0 && (
                                                <button
                                                    className="btn btn-sm btn-outline-secondary text-light"
                                                    onClick={clearAllFilters}
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>

                                        {/* Cuisine Filter */}
                                        <div className="mb-3">
                                            <label className="form-label text-light">Cuisine</label>
                                            <select
                                                className="form-select bg-dark text-light border-secondary"
                                                value={filters.cuisine}
                                                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                                            >
                                                <option value="">All Cuisines</option>
                                                {cuisines.map((cuisine, index) => (
                                                    <option key={index} value={cuisine}>{cuisine}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Rating Filter */}
                                        <div className="mb-3">
                                            <label className="form-label text-light">Minimum Rating</label>
                                            <select
                                                className="form-select bg-dark text-light border-secondary"
                                                value={filters.rating}
                                                onChange={(e) => handleFilterChange('rating', e.target.value)}
                                            >
                                                <option value="">Any Rating</option>
                                                <option value="3">3+ Stars</option>
                                                <option value="4">4+ Stars</option>
                                                <option value="5">5 Stars</option>
                                            </select>
                                        </div>

                                        {/* Cooking Time Filter */}
                                        <div className="mb-3">
                                            <label className="form-label text-light">Cooking Time</label>
                                            <select
                                                className="form-select bg-dark text-light border-secondary"
                                                value={filters.cookingTime}
                                                onChange={(e) => handleFilterChange('cookingTime', e.target.value)}
                                            >
                                                <option value="">Any Time</option>
                                                <option value="quick">Quick (≤ 30 min)</option>
                                                <option value="medium">Medium (30-60 min)</option>
                                                <option value="long">Long ( 1 hour)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Applied Filters */}
                        {appliedFilters.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {appliedFilters.map((filter, index) => (
                                    <div key={index}
                                         className="badge bg-warning bg-opacity-25 text-warning px-3 py-2 d-flex align-items-center gap-2">
                                        {filter.label}
                                        <button
                                            className="btn-close btn-close-white p-0 ms-1"
                                            style={{fontSize: '0.6rem'}}
                                            onClick={() => removeFilter(filter.type)}
                                        ></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Recipe Cards */}
                        {filteredRecipes.length > 0 ? (
                            <div className="row g-4">
                                {filteredRecipes.map((recipe, index) => (
                                    <div key={recipe.id || index} className="col-md-6 col-lg-3">
                                        <RecipeCard {...recipe} onFavorite={addToFavorite}/>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <div className="mb-3">
                                    <X size={40} className="text-warning"/>
                                </div>
                                <h4 className="text-light">No recipes match your filters</h4>
                                <p className="text-muted">Try adjusting your filters or browse all recipes</p>
                                <button className="btn btn-warning mt-2" onClick={clearAllFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {filteredRecipes.length > 0 && (
                            <div className="text-center mt-5">
                                <button className="btn btn-success btn-lg px-5">Load More</button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;

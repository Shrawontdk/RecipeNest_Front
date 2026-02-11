import React, {useEffect, useState} from "react";
import {Calendar, Clock, Star, Trash2} from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../config/api.ts";

function RecipeCard({
                        favoriteId,
                        recipeId,
                        imagePath,
                        title,
                        cookingTime,
                        averageRating,
                        description = "",
                        onRemove,
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
        <div className="card h-100 border-0 rounded-4 overflow-hfavoriteIdden">
            <div className="position-relative">
                <img src={`${API_BASE_URL}${imagePath}`} className="card-img-top"
                     style={{height: '200px', objectFit: 'cover'}} alt={title}/>
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
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-1">
                        <Clock size={14} className="text-muted"/>
                        <span className="text-muted small">{cookingTime}</span>
                        <span className="mx-2">•</span>
                        <Calendar size={14} className="me-1"/>
                        <span className="text-muted small">{formattedDate}</span>
                        {/* Remove Favorite Button */}
                        <button className="btn btn-sm btn-outline-danger ms-4" onClick={() => onRemove(favoriteId)}>
                            <Trash2 size={14}/>
                        </button>
                    </div>
                </div>
                <p className="card-text text-muted small mb-3 clamp-description" title={description}>
                    {description}
                </p>
                <button className="view-recipe-btn" onClick={() => navigate(`/recipeDetails/${recipeId}`)}>
                    <span className="view-recipe-shadow"></span>
                    <span className="view-recipe-edge"></span>
                    <span className="view-recipe-front">View Recipe</span>
                </button>
            </div>
        </div>
    );
}

function Favourite() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token"); // Replace with your actual key
            const response = await axios.get(`${API_BASE_URL}/api/favorites`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFavorites(response.data);
        } catch (error) {
            console.error("Error fetching favorite recipes:", error);
        }
    };

    const handleRemove = async (favoriteId) => {
        try {
            const token = localStorage.getItem("token"); // Replace with your actual key
            await axios.delete(`${API_BASE_URL}/api/favorites/${favoriteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Recipe removed from favorites");
            fetchFavorites();
        } catch (error) {
            console.error("Error removing favorite recipe:", error);
        }
    };

    return (
        <div className="bg-dark background text-light min-vh-100">
            <div className="background">
                <Navbar/>
                <section className="py-5">
                    <div className="container">
                        <h3 className="fs-1 mb-4 text-warning">Favourite Recipes</h3>
                        <div className="row g-4">
                            {favorites.map((recipe: any, index) => (
                                <div key={recipe.favoriteId || index} className="col-md-6 col-lg-3">
                                    <RecipeCard {...recipe} onRemove={handleRemove}/>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-5">
                            <button className="btn btn-success btn-lg px-5">Load More</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Favourite;

import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Bookmark, ChefHat, Clock, Heart, Printer, Share2, Star, Users} from "lucide-react";
import Navbar from "./Navbar";
import {getUserId} from "../utilities/auth.ts";
import {API_BASE_URL} from "../config/api.ts";

function RecipeDetails() {
    const {id} = useParams();
    const [recipe, setRecipe] = useState(null);
    const [relatedRecipes, setRelatedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(0);
    const dummyUserImg = "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png";

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
                const data = await response.json();
                setRecipe(data);

                // Now fetch all recipes to find related ones
                fetchRelatedRecipes(data);
            } catch (error) {
                console.error("Failed to fetch recipe", error);
                setLoading(false);
            }
        };

        const fetchRelatedRecipes = async (currentRecipe) => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/recipes/all`);
                const allRecipes = response.data;

                // Filter out the current recipe and find related ones
                // You can implement your own logic here to determine what makes a recipe "related"
                // For example, recipes with similar tags, categories, or ingredients
                const related = allRecipes
                    .filter(r => r.id !== currentRecipe.id)
                    .slice(0, 3); // Take 3 related recipes

                setRelatedRecipes(related);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching related recipes:", error);
                setLoading(false);
            }
        };

        fetchRecipe();
        fetchComment();
    }, [id]);
    const fetchComment = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/Review/${id}`);
            setComments(response.data);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        submitComment();
    };
    const submitComment = async () => {
        const token = localStorage.getItem("token");
        const userId = getUserId();

        try {
            // Submit new comment
            await axios.post(
                `${API_BASE_URL}/api/Review`, // replace with your actual endpoint
                {
                    recipeId: recipe.id,
                    userId: userId,
                    comment: newComment,
                    rating
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNewComment("");
            setRating(0);

            // Refresh comments after submission
            fetchComment();
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning">
                    <h5>Recipe Not Found</h5>
                    <p>Sorry, we couldn't find the recipe you're looking for.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-dark background min-vh-100">
            <Navbar/>
            <div className="container py-4">
                {/* Hero section with image overlay */}
                <div className="position-relative rounded-3 overflow-hidden mb-4 shadow-sm">
                    <img
                        src={`${API_BASE_URL}${recipe.imagePath}`}
                        alt={recipe.title}
                        className="img-fluid w-100"
                        style={{height: "300px", objectFit: "cover"}}
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>
                    <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white">
                        <div className="container">
                            <h2 className="mb-2">{recipe.title}</h2>
                            <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
                                <div className="d-flex align-items-center">
                                    <Clock size={16} className="me-1"/>
                                    <span className="small">{recipe.prepTime}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Users size={16} className="me-1"/>
                                    <span className="small">{recipe.servings} servings</span>
                                </div>
                                <div className="ms-auto d-flex gap-2">
                                    <button className="btn btn-sm btn-light rounded-pill">
                                        <Printer size={14}/>
                                    </button>
                                    <button className="btn btn-sm btn-light rounded-pill">
                                        <Share2 size={14}/>
                                    </button>
                                    <button className="btn btn-sm btn-warning rounded-pill">
                                        <Bookmark size={14}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        {/* Recipe description */}
                        <div className="card border-0 rounded-3 shadow-sm mb-4">
                            <div className="card-body p-3">
                                <h5 className="card-title">About this recipe</h5>
                                <p className="card-text">{recipe.description}</p>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="card border-0 rounded-3 shadow-sm mb-4">
                            <div className="card-header bg-warning bg-opacity-10 border-0 rounded-top-3">
                                <h5 className="mb-0 py-1 px-2">Ingredients</h5>
                            </div>
                            <div className="card-body p-0 py-2">
                                <ul className="list-group list-group-flush">
                                    {recipe.ingredients?.map((item, index) => (
                                        <li className="list-group-item py-2 d-flex align-items-center" key={index}>
                                            <div className="form-check">
                                                <input
                                                    id={`ingredient-${index}`}
                                                    type="checkbox"
                                                    className="form-check-input me-2"
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`ingredient-${index}`}
                                                >
                                                    {item}
                                                </label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="card border-0 rounded-3 shadow-sm mb-4">
                            <div className="card-header bg-primary bg-opacity-10 border-0 rounded-top-3">
                                <h5 className="mb-0 py-1 px-2">Instructions</h5>
                            </div>
                            <div className="card-body p-0 py-2">
                                <ol className="list-group list-group-flush">
                                    {recipe.steps?.map((step, index) => (
                                        <li className="list-group-item py-2 d-flex" key={index}>
                                            <div
                                                className="bg-primary bg-opacity-10 rounded-circle text-primary me-2 p-1 d-flex align-items-center justify-content-center"
                                                style={{width: "28px", height: "28px", minWidth: "28px"}}>
                                                {index + 1}
                                            </div>
                                            <div className="pt-1">{step}</div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="card border-0 rounded-3 shadow-sm mb-4">
                            <div className="card-header bg-light border-0 rounded-top-3">
                                <h5 className="mb-0 py-1 px-2">Reviews</h5>
                            </div>
                            <div className="card-body">
                                {comments.map((c: any, index) => (
                                    <div className="card mb-3 border-0 shadow-sm" key={index}>
                                        <div className="card-body">
                                            <div className="d-flex mb-2">
                                                <img
                                                    src={c.user?.profileImageUrl ? `${API_BASE_URL}${c.user?.profileImageUrl}` : dummyUserImg}
                                                    alt="User"
                                                    className="rounded-circle me-2"
                                                    style={{width: "40px", height: "40px", objectFit: "cover"}}/>
                                                <div>
                                                    <h6 className="mb-0">{c.user?.name}</h6>
                                                    <small
                                                        className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
                                                </div>
                                                <div className="ms-auto">
                                                    {[...Array(c.rating)].map((_, i) => (
                                                        <Star key={i} size={14} fill="#ffc107"
                                                              className="text-warning"/>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="card-text">{c.comment}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="card border-0 shadow-sm bg-light bg-opacity-50">
                                    <div className="card-body p-3">
                                        <h5 className="card-title mb-2">Leave a Comment</h5>
                                        <form>
                                            <div className="mb-3">
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    placeholder="Share your thoughts..."
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                />

                                                <div className="d-flex mt-3">
                                                    <div className="rating mt-2">
                                                        {[5, 4, 3, 2, 1].map((star) => (
                                                            <React.Fragment key={star}>
                                                                <input
                                                                    type="radio"
                                                                    id={`star-${star}`}
                                                                    name="star-radio"
                                                                    value={star}
                                                                    checked={rating === star}
                                                                    onChange={() => setRating(star)}
                                                                />
                                                                <label htmlFor={`star-${star}`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                         viewBox="0 0 24 24">
                                                                        <path pathLength="360"
                                                                              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                                                                    </svg>
                                                                </label>
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="animated-submit-btn"
                                                        onClick={handleSubmit}
                                                        style={{marginLeft: '1rem'}}
                                                    >
                                                        <div className="svg-wrapper-1">
                                                            <div className="svg-wrapper">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    width="24"
                                                                    height="24"
                                                                >
                                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <span>Submit</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        {/* Chef Card */}
                        <div className="card border-0 rounded-3 shadow-sm mb-4 overflow-hidden">
                            <div className="bg-primary bg-opacity-10 p-3">
                                <div className="d-flex align-items-center">
                                    <div className="position-relative">
                                        <img
                                            src={`${API_BASE_URL}${recipe.chefImage}`}
                                            alt={recipe.chefName || "Chef"}
                                            className="rounded-circle border border-2 border-white"
                                            style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                        />
                                        <div className="position-absolute bottom-0 end-0 bg-warning rounded-circle p-1">
                                            <ChefHat size={12}/>
                                        </div>
                                    </div>
                                    <div className="ms-2">
                                        <h6 className="mb-1">{recipe.chefName || "Chef"}</h6>
                                        <span
                                            className="badge bg-warning text-dark">{recipe.chef?.speciality || "Chef"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-3">
                                <p className="text-muted mb-2 small">{recipe.chef?.bio || "Professional chef specializing in creative cuisine."}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>{recipe.chefTotalRecipes || "3"}+ Recipes</span>
                                    <button className="btn btn-sm btn-outline-primary">View Profile</button>
                                </div>
                            </div>
                        </div>

                        {/* Nutrition Card */}
                        <div className="card border-0 rounded-3 shadow-sm mb-4">
                            <div className="card-header bg-success bg-opacity-10 border-0 rounded-top-3">
                                <h5 className="mb-0 py-1 px-2 text-success">Nutrition Facts</h5>
                            </div>
                            <div className="card-body p-0 py-2">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                        <span>Calories</span>
                                        <span
                                            className="badge bg-success rounded-pill">{recipe.nutrition?.calories || "250 kcal"}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                        <span>Fat</span>
                                        <span
                                            className="badge bg-light text-dark rounded-pill">{recipe.nutrition?.fat || "10g"}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                        <span>Carbs</span>
                                        <span
                                            className="badge bg-light text-dark rounded-pill">{recipe.nutrition?.carbs || "30g"}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                        <span>Protein</span>
                                        <span
                                            className="badge bg-light text-dark rounded-pill">{recipe.nutrition?.protein || "15g"}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Related Recipes */}
                        <div className="card border-0 rounded-3 shadow-sm mb-4">
                            <div className="card-header bg-light border-0 rounded-top-3">
                                <h5 className="mb-0 py-1 px-2">Related Recipes</h5>
                            </div>
                            <div className="card-body p-0 py-2">
                                {relatedRecipes.length > 0 ? (
                                    relatedRecipes.map((relatedRecipe: any, idx) => (
                                        <Link
                                            key={idx}
                                            to={`/recipeDetails/${relatedRecipe.id}`}
                                            className="list-group-item list-group-item-action border-0 p-2"
                                        >
                                            <div className="d-flex gap-2 align-items-center">
                                                <div className="position-relative">
                                                    <img
                                                        src={`${API_BASE_URL}${relatedRecipe.imagePath}`}
                                                        alt={relatedRecipe.title}
                                                        className="rounded"
                                                        style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                                    />
                                                    <div
                                                        className="position-absolute top-0 end-0 bg-danger bg-opacity-75 rounded-circle p-1">
                                                        <Heart size={10} className="text-white"/>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1">{relatedRecipe.title}</h6>
                                                    <div className="d-flex align-items-center text-muted small">
                                                        <Clock size={12} className="me-1"/>
                                                        <span
                                                            className="me-2">{relatedRecipe.cookingTime || "30 min"}</span>
                                                        <Users size={12} className="me-1"/>
                                                        <span>{relatedRecipe.servings || "2"} servings</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-3 text-center text-muted">
                                        <p>No related recipes found</p>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-white border-0 rounded-bottom-3 p-2">
                                <Link to="/" className="btn btn-sm btn-outline-primary w-100">See More Recipes</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetails;

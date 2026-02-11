import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {getUserId} from "../utilities/auth.ts";
import {Edit, Filter, Plus, Search, Trash2} from 'lucide-react';
import Navbar from "./Navbar.tsx";
import {toast} from "react-toastify";
import {GrView} from "react-icons/gr";
import {API_BASE_URL} from "../config/api.ts";

function MyRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(6);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const userId = getUserId();
    const [selectedCuisine, setSelectedCuisine] = useState("");

    useEffect(() => {
        if (userId) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/api/Recipes/createdby/${userId}`)
                .then(res => {
                    setRecipes(res.data.recipes || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError("Failed to fetch recipes");
                    setLoading(false);
                });
        }
    }, [userId]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/Recipes/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setRecipes(prev => prev.filter(r => r.id !== id));
            toast.success("Recipe deleted successfully!");
        } catch (error) {
            console.error("Error deleting recipe:", error);
            toast.error("Failed to delete the recipe.");
        }
    };

    const cuisines = [...new Set(recipes.map((recipe: any) => recipe.cuisine))];

    const filteredRecipes = recipes.filter((recipe: any) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCuisine === "" || recipe.cuisine === selectedCuisine)
    );

    // Pagination calculations
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="background min-vh-100">
            <Navbar/>
            <div className="container py-5">
                <div className="card shadow-sm border-0 rounded-4 mb-4">
                    <div className="card-header bg-white border-0 pt-4 pb-3">
                        <div
                            className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <h4 className="mb-0 fw-bold text-primary">My Recipe Collection</h4>
                            <div className="d-flex gap-2">
                                <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                    <Search size={18}/>
                </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0"
                                        placeholder="Search recipes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                    <Filter size={18} className="text-muted"/>
                </span>
                                    <select
                                        className="form-select border-start-0"
                                        value={selectedCuisine}
                                        onChange={(e) => {
                                            setSelectedCuisine(e.target.value);
                                        }}
                                    >
                                        <option value="">All Cuisines</option>
                                        {cuisines.map((cuisine, index) => (
                                            <option key={index} value={cuisine}>{cuisine}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Fixed Add Recipe Button */}
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/createRecipe')}
                                    style={{width: '120px', whiteSpace: 'nowrap'}}
                                >
                                    <Plus size={18} className="me-1"/>
                                    Add Recipe
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="d-flex justify-content-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger m-4" role="alert">
                                {error}
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Recipe Name</th>
                                        <th>Category</th>
                                        <th>Date Added</th>
                                        <th>Reviews</th>
                                        <th className="text-end pe-4">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentRecipes.length > 0 ? (
                                        currentRecipes.map((recipe: any) => (
                                            <tr key={recipe.id}>
                                                <td className="ps-4 fw-medium">
                                                    <div className="d-flex align-items-center">
                                                        <span>{recipe.title}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                        <span className="badge bg-info bg-opacity-10 text-info">
                                                            {recipe.cuisine}
                                                        </span>
                                                </td>
                                                <td>{new Date(recipe.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}</td>
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
                                                <td className="text-end pe-4">
                                                    <div className="btn-group gap-2">
                                                        <button className="btn btn-sm btn-outline-primary"
                                                                onClick={() => navigate(`/recipeDetails/${recipe.id}`)}>
                                                            <GrView size={16}/>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => navigate(`/createRecipe/${recipe.id}`)}
                                                            title="Edit Recipe"
                                                        >
                                                            <Edit size={16}/>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(recipe.id)}
                                                            title="Delete Recipe"
                                                        >
                                                            <Trash2 size={16}/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5">
                                                <div className="py-4">
                                                    <div className="text-muted mb-3">No recipes found</div>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => navigate('/createRecipe')}
                                                    >
                                                        Create your first recipe
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    {!loading && filteredRecipes.length > recipesPerPage && (
                        <div className="card-footer bg-white py-3 px-4 border-0">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div className="text-muted small">
                                    Showing {indexOfFirstRecipe + 1} to {Math.min(indexOfLastRecipe, filteredRecipes.length)} of {filteredRecipes.length} recipes
                                </div>
                                <nav aria-label="Recipe pagination">
                                    <ul className="pagination pagination-sm mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(1)}
                                                    aria-label="First">
                                                &laquo;
                                            </button>
                                        </li>
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                                                &lsaquo;
                                            </button>
                                        </li>

                                        {/* Display limited pagination numbers with ellipsis */}
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNumber = i + 1;
                                            // Show first page, last page, and pages around current page
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                            ) {
                                                return (
                                                    <li key={i}
                                                        className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => goToPage(pageNumber)}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    </li>
                                                );
                                            }
                                            // Add ellipsis
                                            if (
                                                (pageNumber === currentPage - 2 && pageNumber > 1) ||
                                                (pageNumber === currentPage + 2 && pageNumber < totalPages)
                                            ) {
                                                return <li key={i} className="page-item disabled"><span
                                                    className="page-link">...</span></li>;
                                            }
                                            return null;
                                        })}

                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                                                &rsaquo;
                                            </button>
                                        </li>
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => goToPage(totalPages)}
                                                    aria-label="Last">
                                                &raquo;
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyRecipes;

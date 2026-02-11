import React, {useEffect, useState} from 'react';
import {Plus, Upload, X} from 'lucide-react';
import Navbar from './Navbar';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {getUserId} from "../utilities/auth.ts";
import {toast} from "react-toastify";
import {API_BASE_URL} from "../config/api.ts";

interface FormErrors {
    title?: string;
    description?: string;
    ingredients?: string;
    steps?: string;
    servings?: any;
    cookTime?: any;
    prepTime?: any;
    image?: string;
    // Add any other error fields you need
}

function CreateRecipe() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [steps, setSteps] = useState(['']);
    const [servings, setServings] = useState('');
    const [cookHours, setCookHours] = useState('');
    const [cookMinutes, setCookMinutes] = useState('');
    const [prepHours, setPrepHours] = useState('');
    const [prepMinutes, setPrepMinutes] = useState('');
    const [cuisine, setCuisine] = useState('Italian');
    const [collection, setCollection] = useState('Main Course');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const {id} = useParams(); // Will exist only when editing
    const isEditMode = Boolean(id);
    const [imageUrl, setImageUrl] = useState<string>('');

    const validate = () => {
        const newErrors: FormErrors = {};


        if (!title.trim()) newErrors.title = 'Recipe title is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (ingredients.length === 0) newErrors.ingredients = 'At least one ingredient is required';
        if (steps.some(step => !step.trim())) newErrors.steps = 'All steps must be filled';
        if (!servings || isNaN(servings) || servings < 1) newErrors.servings = 'Valid servings number is required';
        if ((!cookHours && !cookMinutes) || cookHours < 0 || cookMinutes < 0 || cookMinutes > 59)
            newErrors.cookTime = 'Valid cooking time is required';
        if ((!prepHours && !prepMinutes) || prepHours < 0 || prepMinutes < 0 || prepMinutes > 59)
            newErrors.prepTime = 'Valid prep time is required';
        if (!image && !isEditMode) newErrors.image = 'Recipe image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (isEditMode) {
            axios.get(`${API_BASE_URL}/api/recipes/${id}`)
                .then(res => {
                    const data = res.data;
                    setTitle(data.title || '');
                    setDescription(data.description || '');
                    setIngredients(data.ingredients || []);
                    setSteps(data.steps || ['']);
                    setServings(data.servings?.toString() || '');
                    setCookHours(data.cookingTime?.split(':')[0] || '');
                    setCookMinutes(data.cookingTime?.split(':')[1] || '');
                    setPrepHours(data.prepTime?.split(':')[0] || '');
                    setPrepMinutes(data.prepTime?.split(':')[1] || '');
                    setCuisine(data.cuisine);
                    setCollection(data.collection);
                    setImageUrl(`${API_BASE_URL}${data.imagePath}`);
                })
                .catch(err => console.error('Error loading recipe', err));
        }
    }, [isEditMode, id]);


    const handleAddIngredient = () => {
        if (!newIngredient.trim()) {
            setErrors({...errors, ingredients: 'Ingredient cannot be empty'});
            return;
        }
        setIngredients([...ingredients, newIngredient.trim()]);
        setNewIngredient('');
        setErrors({...errors, ingredients: null});
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
        if (newIngredients.length > 0) {
            setErrors({...errors, ingredients: null});
        }
    };

    const handleAddStep = () => {
        setSteps([...steps, '']);
        setErrors({...errors, steps: null});
    };

    const handleStepChange = (index, value) => {
        const updatedSteps = [...steps];
        updatedSteps[index] = value;
        setSteps(updatedSteps);

        // Clear step error if all steps are filled
        if (value.trim() && !updatedSteps.some(step => !step.trim())) {
            setErrors({...errors, steps: null});
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImageUrl('');
        setErrors({...errors, image: 'Recipe image is required'});
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image type and size
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setErrors({...errors, image: 'Only JPG, PNG or GIF images are allowed'});
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            setErrors({...errors, image: 'Image size must be less than 5MB'});
            return;
        }

        setImage(file);
        setErrors({...errors, image: null});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;
        const userId = getUserId() || "";

        const formData = new FormData();
        formData.append("Title", title);
        formData.append("Description", description);
        formData.append("Servings", servings);
        const formatTime = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
        formData.append("CookingTime", formatTime(cookHours || 0, cookMinutes || 0));
        formData.append("PrepTime", formatTime(prepHours || 0, prepMinutes || 0));
        formData.append("Cuisine", cuisine);
        formData.append("Collection", collection);
        formData.append("Image", image);
        formData.append("CreatedBy", userId);
        ingredients.forEach((item, idx) => {
            formData.append(`Ingredients[${idx}]`, item);
        });
        steps.forEach((step, idx) => {
            formData.append(`Steps[${idx}]`, step);
        });

        try {
            if (isEditMode) {
                const res = await axios.put(`${API_BASE_URL}/api/recipes/update/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (res) {
                    toast.success("Recipe updated successfully!");
                    navigate('/chefDashboard');
                } else {
                    toast.error("Failed to update recipe.");
                }
            } else {
                const res = await axios.post(`${API_BASE_URL}/api/recipes/create`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (res) {
                    toast.success("Recipe created successfully!");
                    navigate('/chefDashboard');
                } else {
                    toast.error("Failed to create recipe.");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className='background'>
            <div className="min-vh-100">
                <Navbar/>

                <div className="container py-4">
                    <div className="card bg-light">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="mb-0">Create new recipe</h4>
                                <button className="btn btn-danger" onClick={() => navigate("/chefDashboard")}>
                                    <X size={18} className="me-2"/>
                                    Cancel
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Recipe Title */}
                                <div className="mb-4">
                                    <label className="form-label">Recipe Title*</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            setErrors({...errors, title: null});
                                        }}
                                        required
                                    />
                                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                </div>

                                {/* Recipe Image */}
                                <div className="mb-4">
                                    <label className="form-label">Recipe Image*</label>
                                    {image || imageUrl ? (
                                        <div className="position-relative">
                                            <img
                                                src={image ? URL.createObjectURL(image) : imageUrl}
                                                alt="Preview"
                                                className="rounded"
                                                style={{
                                                    width: '200px',
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    border: '1px solid #dee2e6'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                                                onClick={handleRemoveImage}
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <X size={14}/>
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className={`border rounded p-3 ${errors.image ? 'border-danger' : 'border-secondary'}`}
                                            style={{
                                                width: '100%',
                                                maxWidth: '300px',
                                                borderStyle: 'dashed !important',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}>
                                            <label htmlFor="image-upload"
                                                   style={{cursor: 'pointer', width: '100%', height: '100%'}}>
                                                <div
                                                    className="d-flex flex-column align-items-center justify-content-center text-center p-3">
                                                    <Upload size={24} className="mb-2"/>
                                                    <span className="fw-bold">Upload Image</span>
                                                    <small className="text-muted">JPEG, PNG or GIF (Max 5MB)</small>
                                                </div>
                                            </label>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{
                                                    position: 'absolute',
                                                    opacity: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    top: 0,
                                                    left: 0,
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </div>
                                    )}
                                    {errors.image && <div className="text-danger small mt-2">{errors.image}</div>}
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="form-label">Description*</label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        rows={3}
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            setErrors({...errors, description: null});
                                        }}
                                    />
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>

                                {/* Ingredients */}
                                <div className="mb-4">
                                    <label className="form-label">Ingredients*</label>
                                    {errors.ingredients &&
                                        <div className="text-danger small mb-2">{errors.ingredients}</div>}
                                    <div className="d-flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.ingredients ? 'is-invalid' : ''}`}
                                            value={newIngredient}
                                            onChange={(e) => setNewIngredient(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                                        />
                                        <button type="button" className="btn btn-primary" onClick={handleAddIngredient}>
                                            <Plus size={18}/>
                                        </button>
                                    </div>
                                    {ingredients.map((item, index) => (
                                        <div key={index} className="d-flex gap-2 align-items-center mb-2">
                                            <input type="text" className="form-control" value={item} readOnly/>
                                            <button type="button" className="btn btn-outline-danger"
                                                    onClick={() => handleRemoveIngredient(index)}>
                                                <X size={18}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Instructions */}
                                <div className="mb-4">
                                    <label className="form-label">Instructions*</label>
                                    {errors.steps && <div className="text-danger small mb-2">{errors.steps}</div>}
                                    {steps.map((step, index) => (
                                        <div key={index} className="d-flex gap-3 align-items-start mb-3">
                                            <div
                                                className="bg-primary bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                style={{width: '32px', height: '32px'}}>
                                                <span className="fw-bold">{index + 1}</span>
                                            </div>
                                            <textarea
                                                className={`form-control ${errors.steps && !step.trim() ? 'is-invalid' : ''}`}
                                                rows={2}
                                                placeholder="Enter step instructions..."
                                                value={step}
                                                onChange={(e) => handleStepChange(index, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-outline-primary" onClick={handleAddStep}>
                                        <Plus size={18} className="me-2"/>
                                        Add Step
                                    </button>
                                </div>

                                {/* Servings */}
                                <div className="mb-4">
                                    <label className="form-label">Servings*</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.servings ? 'is-invalid' : ''}`}
                                        value={servings}
                                        onChange={(e) => {
                                            setServings(e.target.value);
                                            setErrors({...errors, servings: null});
                                        }}
                                        min="1"
                                        style={{maxWidth: '200px'}}
                                    />
                                    {errors.servings && <div className="invalid-feedback">{errors.servings}</div>}
                                </div>

                                {/* Cooking Time */}
                                <div className="mb-4">
                                    <label className="form-label">Cooking Time*</label>
                                    {errors.cookTime && <div className="text-danger small mb-2">{errors.cookTime}</div>}
                                    <div className="d-flex gap-3" style={{maxWidth: '400px'}}>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.cookTime ? 'is-invalid' : ''}`}
                                            placeholder="Hours"
                                            value={cookHours}
                                            onChange={(e) => {
                                                setCookHours(e.target.value);
                                                setErrors({...errors, cookTime: null});
                                            }}
                                            min="0"
                                        />
                                        <input
                                            type="number"
                                            className={`form-control ${errors.cookTime ? 'is-invalid' : ''}`}
                                            placeholder="Minutes"
                                            value={cookMinutes}
                                            onChange={(e) => {
                                                setCookMinutes(e.target.value);
                                                setErrors({...errors, cookTime: null});
                                            }}
                                            min="0"
                                            max="59"
                                        />
                                    </div>
                                </div>

                                {/* Prep Time */}
                                <div className="mb-4">
                                    <label className="form-label">Prep Time*</label>
                                    {errors.prepTime && <div className="text-danger small mb-2">{errors.prepTime}</div>}
                                    <div className="d-flex gap-3" style={{maxWidth: '400px'}}>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.prepTime ? 'is-invalid' : ''}`}
                                            placeholder="Hours"
                                            value={prepHours}
                                            onChange={(e) => {
                                                setPrepHours(e.target.value);
                                                setErrors({...errors, prepTime: null});
                                            }}
                                            min="0"
                                        />
                                        <input
                                            type="number"
                                            className={`form-control ${errors.prepTime ? 'is-invalid' : ''}`}
                                            placeholder="Minutes"
                                            value={prepMinutes}
                                            onChange={(e) => {
                                                setPrepMinutes(e.target.value);
                                                setErrors({...errors, prepTime: null});
                                            }}
                                            min="0"
                                            max="59"
                                        />
                                    </div>
                                </div>

                                {/* Cuisine */}
                                <div className="mb-4">
                                    <label className="form-label">Cuisine</label>
                                    <select
                                        className="form-select"
                                        value={cuisine}
                                        onChange={(e) => setCuisine(e.target.value)}
                                        style={{maxWidth: '200px'}}
                                    >
                                        <option>Italian</option>
                                        <option>Chinese</option>
                                        <option>Mexican</option>
                                        <option>Indian</option>
                                        <option>American</option>
                                        <option>Japanese</option>
                                        <option>Thai</option>
                                        <option>Mediterranean</option>
                                    </select>
                                </div>

                                {/* Collection */}
                                <div className="mb-4">
                                    <label className="form-label">Collection</label>
                                    <select
                                        className="form-select"
                                        value={collection}
                                        onChange={(e) => setCollection(e.target.value)}
                                        style={{maxWidth: '200px'}}
                                    >
                                        <option>Main Course</option>
                                        <option>Appetizers</option>
                                        <option>Desserts</option>
                                        <option>Beverages</option>
                                        <option>Salads</option>
                                        <option>Soups</option>
                                        <option>Breakfast</option>
                                        <option>Snacks</option>
                                    </select>
                                </div>

                                {/* Submit */}
                                <div className="d-flex justify-content-end mt-4">
                                    <button type="submit" className="btn btn-primary px-4 py-2">
                                        {isEditMode ? 'Update Recipe' : 'Create Recipe'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateRecipe;

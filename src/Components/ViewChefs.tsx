import {useEffect, useState} from "react";
import {BookOpen, Star, Users} from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../config/api.ts";

function ChefCard({id, name, averageRating, recipeCount, engagementCount, profileImageUrl}) {
    const navigate = useNavigate();
    const dummyChefImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D";

    return (
        <div className="card h-100 border-0 rounded-4 overflow-hidden">
            <div className="position-relative">
                <img
                    src={profileImageUrl ? `${API_BASE_URL}${profileImageUrl}` : "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"}
                    className="card-img-top" style={{height: '200px', objectFit: 'cover'}} alt={name}/>
            </div>
            <div className="card-body">
                <h5 className="card-title mb-2">{name}</h5>

                <div className="d-flex align-items-center gap-2 mb-2">
                    <Star size={16} className="text-warning" fill="currentColor"/>
                    <span className="text-warning small">{averageRating?.toFixed(1)}</span>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-primary"/>
                    <span className="small">{recipeCount} Recipes</span>
                </div>

                <div className="d-flex align-items-center gap-2 mb-4">
                    <Users size={16} className="text-success"/>
                    <span className="small">{engagementCount} Engagements</span>
                </div>

                <button className="btn btn-warning w-100" onClick={() => navigate(`/chefRecipes/${id}`)}>
                    View their Recipes
                </button>
            </div>
        </div>
    );
}

function Chefs() {
    const [chefs, setChefs] = useState([]);

    useEffect(() => {
        fetchChefs();
    }, []);

    const fetchChefs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE_URL}/api/user/all-chefs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChefs(response.data);
        } catch (error) {
            console.error("Error fetching chefs:", error);
        }
    };

    return (
        <div className="bg-dark background text-light min-vh-100">
            <Navbar/>
            <section className="py-5">
                <div className="container">
                    <h3 className="fs-1 mb-4 text-warning">Our Chefs</h3>
                    <div className="row g-4">
                        {chefs.map((chef: any, index) => (
                            <div key={chef.id || index} className="col-md-6 col-lg-3">
                                <ChefCard {...chef} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Chefs;

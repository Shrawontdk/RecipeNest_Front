import {useEffect, useState} from 'react';
import {Edit, Mail, Save, Upload} from 'lucide-react';
import Navbar from "./Navbar.tsx";
import axios from 'axios';
import {getUserId} from "../utilities/auth.ts";
import {toast} from "react-toastify";
import {API_BASE_URL} from "../config/api.ts";



interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    dob: string;
    country: string;
    language: string;
    phone: string;
    profileImageUrl: string;
}

function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [error, setError] = useState(false);

    const token = localStorage.getItem('token');
    const userId = getUserId();

    const fetchProfile = () => {
        axios.get(`${API_BASE_URL}/api/User/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                setProfile(res.data);
                setFormData(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch profile', err);
                setError(true);
            });
    };

    useEffect(() => {
        if (!token) {
            console.error("No token found");
            return;
        }
        fetchProfile(); // Initial fetch
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSave = () => {
        if (!formData) return;
        axios.put(`${API_BASE_URL}/api/User/update/${userId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                toast.success("Profile updated successfully!");
                setEditMode(false);
                fetchProfile();
            })
            .catch(error => {
                console.error("Failed to update profile", error);
                toast.error("Failed to update profile");
            });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        axios.post(`${API_BASE_URL}/api/User/upload-profile-image/${userId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                toast.success("Profile image uploaded!");
                fetchProfile();
            })
            .catch(err => {
                console.error("Failed to upload image", err);
                toast.error("Failed to upload profile image");
            });
    };

    if (!profile && !error) return <div>Loading...</div>;

    return (
        <div className="background min-vh-100">
            <Navbar/>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="profile-card">
                            <div className="profile-header">
                                <h4 className="mb-0">Welcome, {profile?.name?.split(' ')[0] || ''}</h4>
                                <small className="text-muted">
                                    {new Date().toLocaleDateString("en-GB", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </small>
                            </div>

                            <div className="p-4">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="position-relative me-3">
                                            <img
                                                src={profile?.profileImageUrl ? `${API_BASE_URL}${profile.profileImageUrl}` : "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"}
                                                alt="Profile"
                                                className="profile-img rounded-circle border shadow-sm"
                                                style={{width: "90px", height: "90px", objectFit: "cover"}}
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{display: 'none'}}
                                                id="profileImageInput"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="profileImageInput"
                                                className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                style={{width: "28px", height: "28px", cursor: "pointer"}}
                                                title="Upload new profile image"
                                            >
                                                <Upload size={14}/>
                                            </label>
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-bold">{profile?.name || ''}</h5>
                                            <small className="text-muted">{profile?.email || ''}</small>
                                        </div>
                                    </div>
                                    {!editMode ? (
                                        <button className="btn btn-outline-primary rounded-pill px-3"
                                                onClick={() => setEditMode(true)}>
                                            <Edit size={16} className="me-1"/>
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <button className="btn btn-success rounded-pill px-3" onClick={handleSave}>
                                            <Save size={16} className="me-1"/>
                                            Save Changes
                                        </button>
                                    )}
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" name="name" className="form-control"
                                               value={formData?.name || ''} onChange={handleChange} readOnly={!editMode}
                                               disabled={!editMode}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Role</label>
                                        <input type="text" className="form-control"
                                               value={formData?.role === 'user' ? 'Food Lover' : 'Chef'} readOnly
                                               disabled/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Date of Birth</label>
                                        <input type="date" name="dob" className="form-control"
                                               value={formData?.dob?.split('T')[0] || ''} onChange={handleChange}
                                               readOnly={!editMode} disabled={!editMode}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Country</label>
                                        <input type="text" name="country" className="form-control"
                                               value={formData?.country || ''} onChange={handleChange}
                                               readOnly={!editMode} disabled={!editMode}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Language</label>
                                        <input type="text" name="language" className="form-control"
                                               value={formData?.language || 'English'} onChange={handleChange}
                                               readOnly={!editMode} disabled={!editMode}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone Number</label>
                                        <input type="text" name="phone" className="form-control"
                                               value={formData?.phone || ''} onChange={handleChange}
                                               readOnly={!editMode} disabled={!editMode}/>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">My email Address</label>
                                        <div className="email-badge d-flex align-items-center mb-2">
                                            <Mail size={16} className="text-primary me-2"/>
                                            <div>
                                                <div>{formData?.email || ''}</div>
                                                <small className="text-muted">1 month ago</small>
                                            </div>
                                        </div>
                                        <a href="#" className="add-email-btn">+ Add Email Address</a>
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

export default Profile;

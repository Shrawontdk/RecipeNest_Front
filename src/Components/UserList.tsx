import {useEffect, useState} from 'react';
import axios from 'axios';
import {Search} from 'lucide-react';
import Navbar from './Navbar';
import {toast} from "react-toastify";
import {API_BASE_URL} from "../config/api.ts";

const USERS_PER_PAGE = 15;

function UserList() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem("token");
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/all-users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); // Replace with your endpoint
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleStatusToggle = async (index, userId, currentStatus) => {
        const updatedStatus = currentStatus === true ? 'Inactive' : 'Active';

        try {
            await axios.put(`${API_BASE_URL}/api/user/toggle-status/${userId}`, {
                status: updatedStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response: any) => {
                fetchUsers();
                response.data?.isActive ? toast.success(response.data.message) : toast.warning(response.data.message);

            })
                .catch(error => {
                    console.error("Failed to update profile", error);
                    toast.error(error);
                });

        } catch (error) {
            toast.error(error);
            console.error('Error updating status:', error);
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const currentUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);

    const goToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };
  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

    return (
        <div className='background'>
            <div className="min-vh-100">
                <Navbar/>

                <div className="container py-4">
                    <div className="card bg-light">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h4 className="mb-1">All Users</h4>
                                    <p className="text-muted mb-0">Active Members</p>
                                </div>
                                <div className="d-flex gap-3 align-items-center">
                                    <div className="position-relative">
                                        <Search size={20}
                                                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"/>
                                        <input
                                            type="text"
                                            className="form-control ps-5"
                                            placeholder="Search"
                                            style={{minWidth: '250px'}}
                                        />
                                    </div>
                                    <select className="form-select">
                                        <option>Sort by: Newest</option>
                                        <option>Sort by: Oldest</option>
                                        <option>Sort by: Name</option>
                                    </select>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th className="text-warning">Users Name</th>
                                        <th className="text-warning">Age</th>
                                        <th className="text-warning">Phone Number</th>
                                        <th className="text-warning">Email</th>
                                        <th className="text-warning">Country</th>
                                        <th className="text-warning">Status</th>
                                        <th className="text-warning">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentUsers.map((user: any, index) => (
                                        <tr key={user.id || index}>
                                            <td>{user.name}</td>
                                            <td>{calculateAge(user.dob)}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.email}</td>
                                            <td>{user.country}</td>
                                            <td>
                          <span
                              className={`badge ${user.isActive === true ? 'bg-success' : 'bg-danger'} bg-opacity-10 ${user.isActive === true ? 'text-success' : 'text-danger'}`}>
                            {user.isActive === true ? 'Active' : 'inactive'}
                          </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn btn-sm ${user.isActive === true ? 'btn-danger' : 'btn-success'}`}
                                                    onClick={() => handleStatusToggle(index, user.id, user.isActive)}
                                                >
                                                    {user.isActive === true ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <small className="text-muted">
                                    Showing {startIndex + 1} to {Math.min(startIndex + USERS_PER_PAGE, users.length)} of {users.length} entries
                                </small>
                                <nav>
                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                                            <button className="page-link"
                                                    onClick={() => goToPage(currentPage - 1)}>&laquo;</button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                                                <button className="page-link"
                                                        onClick={() => goToPage(i + 1)}>{i + 1}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                                            <button className="page-link"
                                                    onClick={() => goToPage(currentPage + 1)}>&raquo;</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserList;

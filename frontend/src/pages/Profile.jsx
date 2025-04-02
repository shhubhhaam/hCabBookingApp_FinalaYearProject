import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserDataContext);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <div className="bg-white shadow-sm">
                <div className="flex justify-between items-center px-6 py-3">
                    <Link to="/">
                        <img 
                            className='w-16 cursor-pointer' 
                            // src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" 
                            src="https://media-hosting.imagekit.io/573a203421164d15/RideX_Logo.png?Expires=1838218633&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=lKqLP6kBXGZhdze4qeG9zKWjvXYmAwxR5x35sKitSAOP3ewgfD2mud1R6wABURINaV8ejMPc0WhIHsEvbtejEzgPCYkmedg8FqJ~FYNzQx-pOGDwbTbD5im7Sd25Tikk2fyqUgEgZaObu1FlZKxcuvl-2zanTpOaFLWEHe4GVSt9Ju4B3ZjhKrx8pyEBwFPvUySxQDfUHaYvuToqZKfrWRzYiWCXheYTLTs2oMulQBjc2GMu~5GvuQJmOyYF6z-PiRA7Uw6j-rJHbh8u2c0TMhmkg9sqYTmQO5pBEoLewZf6zAzPCiWgV9mhYozdmnrRGMXafrnCVQ8h3GTLYLyyNw__" 
                            alt="Uber Logo"
                        />
                    </Link>
                    <Link to="/home">
                        <button 
                            className="text-gray-600 hover:text-gray-900"
                        >
                        <i className="ri-arrow-left-line text-2xl"></i>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col items-center space-x-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <i className="ri-user-line text-3xl text-gray-600"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">{`${userDetails?.fullname?.firstname} ${userDetails?.fullname?.lastname}` || 'User Name'}</h1>
                            <p className="text-gray-600">{userDetails?.email || 'user@example.com'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="border-b pb-4">
                            <h2 className="text-lg font-medium mb-2">Personal Information</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium">{userDetails?.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{userDetails?.email || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-b pb-4">
                            <h2 className="text-lg font-medium mb-2">Account Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Account Type</p>
                                    <p className="font-medium">User</p>
                                </div>
                                <div>
                                    {/* <p className="text-sm text-gray-500">Member Since</p> */}
                                    {/* <p className="font-medium">
                                        {new Date(userDetails?.createdAt).toLocaleDateString() || 'Not available'}
                                    </p> */}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link to="/login">
                                <button 
                                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                    Logout
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 
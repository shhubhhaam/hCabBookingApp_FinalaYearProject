import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CapatainContext';

const CaptainProfile = () => {
    const navigate = useNavigate();
    const { captain } = useContext(CaptainDataContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCaptainDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile details');
                setLoading(false);
            }
        };

        fetchCaptainDetails();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <div className="bg-white shadow-sm">
                <div className="flex justify-between items-center px-6 py-3">
                <img className='w-16' 
                    src="https://media-hosting.imagekit.io/deae673a49484df6/RideX_logo_captain.png?Expires=1838219093&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tpt6CJGM1ph8tgLRLQlXOgyR32OB5-UdH25AshFCFB1zcrPTb9s1cl-6DQV9BYwWMf2nRPDWGamL-Hm7YkuourShOzP~rBMZc9T8RMxZNXa2HEut4IZbOQtq0Udedztl6ZhdnDsIKHL5HfUSeiR746vhIy4Y17myh5rpUX4IDOYHCEqZh7S48vdBYctgOdoAKMlpZZj6EfkYb5dpGW8ppDxRvtsjQlZXib-2f4ReKScry0K6NdfRIU3t99GBbXaxV1797UfR8~YoR9~WEMYwKBG7jcfVU8JKNYL-ALH73aGsH9LEoXRTw8V5Ur0o93fsq0u~b4YO45x03NWNUU2feA__" 
                    alt="Logo" />
                    <div className="relative group">
                        <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                            <i className="ri-user-line text-xl"></i>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                            <button 
                                onClick={() => navigate('/captain-profile')}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                            >
                                <i className="ri-user-line"></i>
                                Profile
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/captain-login');
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                            >
                                <i className="ri-logout-box-line"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Captain Profile</h1>
                        <button 
                            onClick={() => navigate('/captain-home')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <i className="ri-arrow-left-line text-xl"></i>
                        </button>
                    </div>

                    {/* Personal Information */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                    <i className="ri-user-line text-3xl text-gray-600"></i>
                                </div>
                                <div>
                                    <h3 className="font-medium">{captain?.fullname.firstname} {captain?.fullname.lastname}</h3>
                                    <p className="text-gray-600">{captain?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Vehicle Type</p>
                                    <p className="font-medium">{captain?.vehicle.vehicleType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Vehicle Color</p>
                                    <p className="font-medium">{captain?.vehicle.color}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">License Plate</p>
                                    <p className="font-medium">{captain?.vehicle.plate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Capacity</p>
                                    <p className="font-medium">{captain?.vehicle.capacity} passengers</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Account Status</h2>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${captain?.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <p className="font-medium">{captain?.isAvailable ? 'Available for rides' : 'Currently on a ride'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaptainProfile; 
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';
import axios from 'axios';

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);
    const [ride, setRide] = useState(null);
    const navigate = useNavigate();
    
    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);

    useEffect(() => {
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        });

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    });
                });
            }
        };

        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation();
    }, []);

    socket.on('new-ride', (data) => {
        console.log('🔴 New ride received:', data);
        if (!data) {
            console.error('🚨 No ride data received!');
        }
        setRide(data);
        setRidePopupPanel(true);
    });
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/captain-login');
    };

    async function confirmRide() {
        console.log('Confirming ride:', ride);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: ride._id,
                captainId: captain._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Ride confirmed:', response.data);
            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
        } catch (error) {
            console.error('Error confirming ride:', error);
        }
    }

    useGSAP(() => {
        gsap.to(ridePopupPanelRef.current, {
            transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)'
        });
    }, [ridePopupPanel]);

    useGSAP(() => {
        gsap.to(confirmRidePopupPanelRef.current, {
            transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)'
        });
    }, [confirmRidePopupPanel]);

    return (
        <div className='h-screen'>
            {/* Navbar */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm">
                <div className="flex justify-between items-center px-6 py-3">
                    {/* <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" /> */}
                    {/* <img className='w-16' src="https://media-hosting.imagekit.io/573a203421164d15/RideX_Logo.png?Expires=1838218633&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=lKqLP6kBXGZhdze4qeG9zKWjvXYmAwxR5x35sKitSAOP3ewgfD2mud1R6wABURINaV8ejMPc0WhIHsEvbtejEzgPCYkmedg8FqJ~FYNzQx-pOGDwbTbD5im7Sd25Tikk2fyqUgEgZaObu1FlZKxcuvl-2zanTpOaFLWEHe4GVSt9Ju4B3ZjhKrx8pyEBwFPvUySxQDfUHaYvuToqZKfrWRzYiWCXheYTLTs2oMulQBjc2GMu~5GvuQJmOyYF6z-PiRA7Uw6j-rJHbh8u2c0TMhmkg9sqYTmQO5pBEoLewZf6zAzPCiWgV9mhYozdmnrRGMXafrnCVQ8h3GTLYLyyNw__" alt="Uber Logo" /> */}
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
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                            >
                                <i className="ri-logout-box-line"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif' alt='' />
            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                {/* {console.log('Passing ride to RidePopUp:', ride)} */}
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                {/* {console.log('Passing ride to ConfirmRidePopUp:', ride)} */}
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel} 
                />
            </div>
        </div>
    );
};

export default CaptainHome;

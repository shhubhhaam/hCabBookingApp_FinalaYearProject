import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [ pickup, setPickup ] = useState(() => {
        const saved = localStorage.getItem('uber_trip_pickup');
        return saved || '';
    });
    const [ destination, setDestination ] = useState(() => {
        const saved = localStorage.getItem('uber_trip_destination');
        return saved || '';
    });
    const [ vehicleType, setVehicleType ] = useState(() => {
        const saved = localStorage.getItem('uber_trip_vehicleType');
        return saved || null;
    });
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState(() => {
        const saved = localStorage.getItem('uber_trip_fare');
        return saved ? JSON.parse(saved) : {};
    })
    const [ ride, setRide ] = useState(null)
    const [ isCancelling, setIsCancelling ] = useState(false)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('uber_trip_pickup', pickup);
        localStorage.setItem('uber_trip_destination', destination);
        localStorage.setItem('uber_trip_vehicleType', vehicleType);
        localStorage.setItem('uber_trip_fare', JSON.stringify(fare));
    }, [pickup, destination, vehicleType, fare]);

    useEffect(() => {
        console.log(user)
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    socket.on('ride-confirmed', ride => {
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } })
    })

    socket.on('ride-cancelled', () => {
        handleCancelTrip();
    });

    socket.on('ride-ended', () => {
        // Clear all trip data from localStorage
        localStorage.removeItem('uber_trip_pickup');
        localStorage.removeItem('uber_trip_destination');
        localStorage.removeItem('uber_trip_vehicleType');
        localStorage.removeItem('uber_trip_fare');
        
        // Reset all states
        setPickup('');
        setDestination('');
        setVehicleType(null);
        setFare({});
        setRide(null);
        setVehicleFound(false);
        setWaitingForDriver(false);
        setConfirmRidePanel(false);
        setVehiclePanel(false);
    });

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '50%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)',
                height: '80%',
                padding: 24
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)',
                height: '0%',
                padding: 0
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setFare(response.data)
    }

    async function createRide() {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/create`,
                {
                    pickup,
                    destination,
                    vehicleType
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
    
            console.log("🚗 Ride Created Successfully:", JSON.stringify(response.data, null, 2));
            setRide(response.data.ride);
    
        } catch (error) {
            console.error("❌ Error Creating Ride:", error.response ? error.response.data : error.message);
        }
    }

    const handleCancelTrip = async () => {
        if (!ride) return;
        
        setIsCancelling(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/cancel`,
                { rideId: ride._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            // Clear all trip data from localStorage
            localStorage.removeItem('uber_trip_pickup');
            localStorage.removeItem('uber_trip_destination');
            localStorage.removeItem('uber_trip_vehicleType');
            localStorage.removeItem('uber_trip_fare');
            
            // Reset all states
            setPickup('');
            setDestination('');
            setVehicleType(null);
            setFare({});
            setRide(null);
            setVehicleFound(false);
            setWaitingForDriver(false);
            setConfirmRidePanel(false);
            setVehiclePanel(false);
            
            // Navigate to home
            navigate('/home');
        } catch (error) {
            console.error("Error cancelling trip:", error);
        } finally {
            setIsCancelling(false);
        }
    }
    
    const handleLogout = () => {
        // Clear trip data on logout
        localStorage.removeItem('uber_trip_pickup');
        localStorage.removeItem('uber_trip_destination');
        localStorage.removeItem('uber_trip_vehicleType');
        localStorage.removeItem('uber_trip_fare');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className='h-screen relative overflow-hidden'>
            {/* Navbar */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm">
                <div className="flex justify-between items-center px-6 py-3">
                    <img className='w-16' 
                    src="https://media-hosting.imagekit.io/573a203421164d15/RideX_Logo.png?Expires=1838218633&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=lKqLP6kBXGZhdze4qeG9zKWjvXYmAwxR5x35sKitSAOP3ewgfD2mud1R6wABURINaV8ejMPc0WhIHsEvbtejEzgPCYkmedg8FqJ~FYNzQx-pOGDwbTbD5im7Sd25Tikk2fyqUgEgZaObu1FlZKxcuvl-2zanTpOaFLWEHe4GVSt9Ju4B3ZjhKrx8pyEBwFPvUySxQDfUHaYvuToqZKfrWRzYiWCXheYTLTs2oMulQBjc2GMu~5GvuQJmOyYF6z-PiRA7Uw6j-rJHbh8u2c0TMhmkg9sqYTmQO5pBEoLewZf6zAzPCiWgV9mhYozdmnrRGMXafrnCVQ8h3GTLYLyyNw__" 
                    alt="Logo" />
                    <div className="relative group">
                        <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                            <i className="ri-user-line text-xl"></i>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                            <button 
                                onClick={() => navigate('/profile')}
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

            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[35%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={submitHandler}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} 
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehiclePanel={setVehiclePanel} 
                />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehicleFound={setVehicleFound} 
                />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} 
                />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver}
                    onCancelTrip={handleCancelTrip}
                    isCancelling={isCancelling}
                />
            </div>
        </div>
    )
}

export default Home

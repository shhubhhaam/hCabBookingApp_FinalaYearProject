import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm p-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img 
                            className="h-16 w-16 rounded-full object-cover border-2 border-gray-100" 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" 
                            alt="Captain Profile" 
                        />
                        <div>
                            <h3 className="text-xl font-semibold capitalize">
                                {captain.fullname.firstname + " " + captain.fullname.lastname}
                            </h3>
                            <p className="text-gray-500">Captain</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-xl shadow-sm pb-6">
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <i className="ri-car-line text-xl"></i>
                    Vehicle Information
                </h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-sm text-gray-500">Vehicle Type</p>
                                <p className="capitalize">{captain.vehicle.vehicleType}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-sm text-gray-500">Color</p>
                                <p className="capitalize">{captain.vehicle.color}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-sm text-gray-500">Plate Number</p>
                                <p>{captain.vehicle.plate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-sm text-gray-500">Capacity</p>
                                <p>{captain.vehicle.capacity} passengers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails
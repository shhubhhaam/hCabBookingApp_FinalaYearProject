import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Start = () => {
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

  const handleContinue = (e) => {
    e.preventDefault()
    setShowPopup(true)
  }

  const handleSelection = (type) => {
    setShowPopup(false)
    if (type === 'rider') {
      navigate('/login')
    } else if (type === 'captain') {
      navigate('/captain-login')
    }
  }

  return (
    <div className="relative">
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full'>
      <img className='w-20 mb-10 bg-white p-2 rounded-xl ml-10' 
          src="https://media-hosting.imagekit.io/573a203421164d15/RideX_Logo.png?Expires=1838218633&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=lKqLP6kBXGZhdze4qeG9zKWjvXYmAwxR5x35sKitSAOP3ewgfD2mud1R6wABURINaV8ejMPc0WhIHsEvbtejEzgPCYkmedg8FqJ~FYNzQx-pOGDwbTbD5im7Sd25Tikk2fyqUgEgZaObu1FlZKxcuvl-2zanTpOaFLWEHe4GVSt9Ju4B3ZjhKrx8pyEBwFPvUySxQDfUHaYvuToqZKfrWRzYiWCXheYTLTs2oMulQBjc2GMu~5GvuQJmOyYF6z-PiRA7Uw6j-rJHbh8u2c0TMhmkg9sqYTmQO5pBEoLewZf6zAzPCiWgV9mhYozdmnrRGMXafrnCVQ8h3GTLYLyyNw__"/><div className='bg-white pb-8 py-4 px-4'>
          <h2 className='text-[30px] font-semibold'>Get Started with Uber</h2>
          <button 
            onClick={handleContinue}
            className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'
          >
            Continue
          </button>
        </div>
      </div>

      {/* User Type Selection Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Choose Your Role</h3>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleSelection('rider')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Rider</h4>
                  <p className="text-gray-500 text-sm">Book rides and travel with ease</p>
                </div>
              </button>
              
              <button 
                onClick={() => handleSelection('captain')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Captain</h4>
                  <p className="text-gray-500 text-sm">Earn by driving passengers</p>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => setShowPopup(false)}
              className="mt-6 text-gray-500 hover:text-gray-700 w-full py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Start
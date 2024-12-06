import React, { useState } from 'react';
import axios from 'axios';
import AlertBox from '../components/AlertBox';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    phone: '',
    department: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const navigate = useNavigate();

  const navigateToAboutPage = () => {
    // navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    try {
      const res = await axios.post('http://localhost:8000/api/v1/users/register', {
        fullName: formData.name,
        email: formData.email, username: formData.userId, password: formData.password, department: formData.department, phoneNumber: formData.phone
      }, { withCredentials: true });
      console.log(res);
      if (res.data.statusCode == 200) {
        console.log("Success on login");
        AlertBox(1,"User registered successfully!!");
        // navigateToAboutPage();
      } else {
        console.log("Error on login");
      }

    } catch (e) {
      console.log(e);
      alert(e);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-2xl border border-blue-700">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center font-serif text-orange-500 mb-2 md:mb-4">UIAMS</h1>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-center font-serif text-blue-600 mb-3 md:mb-5">REGISTER</h2>
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 my-1"
          />
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            value={formData.userId}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone No."
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <select
            
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full mb-3 sm:mb-4 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>Select your department</option>
            <option>Software</option>
            <option>Electrician</option>
          </select>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 sm:py-3 md:py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300 md:text-lg"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

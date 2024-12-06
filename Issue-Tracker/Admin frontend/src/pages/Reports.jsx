// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';

// function Reports(issues) {
//   const [tasks, settasks] = useState([]);

//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
    
//     axios.get('http://localhost:8000/api/v1/users/fetch-report',
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//         withCredentials: true
//       })
//       .then((response) => {
//         settasks(response.data.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   return (
//     <>
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Header />

//         <main className="px-4 sm:px-6 lg:px-8 py-8">
//           <section className="text-center">
//             <h2 className="text-2xl font-semibold text-indigo-700 mb-6">History</h2>
//             <div className="tasks w-full">
//               {/* Table Headings */}
//               <div className="current grid grid-cols-8 gap-4 bg-indigo-600 text-white p-4 rounded-lg shadow-lg text-sm sm:text-lg ">
//                 <h3 className="font-semibold ">Problem</h3>
//                 <h3 className="font-semibold">Description</h3>
//                 <h3 className="font-semibold">Address</h3>
//                 <h3 className="font-semibold">Completed</h3>
//                 <h3 className="font-semibold">Department</h3>
//                 <h3 className="font-semibold">Acknowledge Time</h3>
//                 <h3 className="font-semibold">Created Time</h3>
//                 <h3 className="font-semibold">Resolved Time</h3>
//               </div>

//               {/* Tasks Data */}
//               <div className="tasks-information overflow-y-auto max-h-[430px] bg-white mt-4 rounded-lg shadow-2xl">
//                 {tasks && tasks.length > 0 ? (
//                   tasks.map((task, index) => (
//                     <div
//                       key={task.id}
//                       className="reports-he grid grid-cols-8 gap-4 p-3 border-b border-gray-200 text-md sm:text-md hover:bg-indigo-50 transition-colors"
//                     >
//                       <p className="text-gray-700">{task.issue}</p>
//                       <p className="text-gray-700">{task.description ? task.description : 'None'}</p>
//                       <p className="text-gray-700">{task.address}</p>
//                       <p className={task.complete ? 'text-green-600' : 'text-red-500'}>
//                         {task.complete ? 'Yes' : 'No'}
//                       </p>
//                       <p className="text-gray-700">{task.requireDepartment}</p>
//                       <p className="text-gray-500">{task.acknowledge_at}</p>
//                       <p className="text-gray-500">{task.createdAt}</p>
//                       <p className="text-gray-500">
//                         {task.updatedAt !== task.createdAt ? task.updatedAt : '-'}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-center p-4 text-gray-500">No tasks available</p>
//                 )}
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </>
//   );
// };

// export default Reports;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Header from './Header';

function Reports() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch tasks data from the API
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    axios.get('http://localhost:8000/api/v1/users/fetch-report', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true
    })
    .then((response) => {
      setTasks(response.data.data);
      setFilteredTasks(response.data.data); // Initialize filteredTasks with all tasks
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  // Function to parse date strings to Date objects
  const parseDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return null;
  
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  // Function to filter tasks based on start and end dates
  const filterByDate = () => {
    if (!startDate || !endDate) return;
  
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
  
    const filtered = tasks.filter(task => {
      const acknowledgeAt = parseDateTime(task.acknowledge_at)?.getTime();
      const createdAt = parseDateTime(task.createdAt)?.getTime();
      const updatedAt = parseDateTime(task.updatedAt)?.getTime();
  
      return (acknowledgeAt && acknowledgeAt >= start && acknowledgeAt <= end) ||
             (createdAt && createdAt >= start && createdAt <= end) ||
             (updatedAt && updatedAt >= start && updatedAt <= end);
    });
  
    setFilteredTasks(filtered);
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTasks.map(task => ({
      Problem: task.issue,
      Description: task.description || 'None',
      Address: task.address,
      Completed: task.complete ? 'Yes' : 'No',
      Department: task.require_department,
      "Acknowledge Time": task.acknowledge_at,
      "Created Time": task.created_at,
      "Resolved Time": task.updated_at !== task.created_at ? task.updated_at : '-'
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks Report");

    XLSX.writeFile(workbook, "Tasks_Report.xlsx");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <section className="text-center">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">History</h2>

            {/* Date Filter and Export Buttons */}
            <div className="flex justify-center mb-6 space-x-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-3 py-2 rounded shadow-sm"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-3 py-2 rounded shadow-sm"
                placeholder="End Date"
              />
              <button
                onClick={filterByDate}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Filter
              </button>
              <button
                onClick={exportToExcel}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition ml-4"
              >
                Export to Excel
              </button>
            </div>

            {/* Table Headings */}
            <div className="current grid grid-cols-8 gap-4 bg-indigo-600 text-white p-4 rounded-lg shadow-lg text-sm sm:text-lg">
              <h3 className="font-semibold">Problem</h3>
              <h3 className="font-semibold">Description</h3>
              <h3 className="font-semibold">Address</h3>
              <h3 className="font-semibold">Completed</h3>
              <h3 className="font-semibold">Department</h3>
              <h3 className="font-semibold">Acknowledge Time</h3>
              <h3 className="font-semibold">Created Time</h3>
              <h3 className="font-semibold">Resolved Time</h3>
            </div>

            {/* Task Display */}
            <div className="tasks-information overflow-y-auto max-h-[430px] bg-white mt-4 rounded-lg shadow-2xl">
              {filteredTasks && filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                      key={task.id}
                      className="reports-he grid grid-cols-8 gap-4 p-3 border-b border-gray-200 text-xs sm:text-sm hover:bg-indigo-50 transition-colors"
                    >
                      <p className="text-gray-700">{task.issue}</p>
                      <p className="text-gray-700">{task.description ? task.description : 'None'}</p>
                      <p className="text-gray-700">{task.address}</p>
                      <p className={task.complete ? 'text-green-600' : 'text-red-500'}>
                        {task.complete ? 'Yes' : 'No'}
                      </p>
                      <p className="text-gray-700">{task.require_department}</p>
                      <p className="text-gray-500">{task.acknowledge_at}</p>
                      <p className="text-gray-500">{task.created_at}</p>
                      <p className="text-gray-500">
                        {task.updated_at !== task.created_at ? task.updated_at : '-'}
                      </p>
                    </div>
                ))
              ) : (
                <p className="text-center p-4 text-gray-500">No tasks available</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Reports;

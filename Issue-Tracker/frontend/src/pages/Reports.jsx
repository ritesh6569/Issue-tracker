import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Header from './Header';

function Reports(issues) {
  const [tasks, settasks] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    axios.get('http://localhost:8000/api/v1/users/fetch-report',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true
      })
      .then((response) => {
        settasks(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <section className="text-center">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">History</h2>
            <div className="tasks w-full">
              {/* Table Headings */}
              <div className="current grid grid-cols-8 gap-4 bg-indigo-600 text-white p-4 rounded-lg shadow-lg text-sm sm:text-lg ">
                <h3 className="font-semibold ">Problem</h3>
                <h3 className="font-semibold">Description</h3>
                <h3 className="font-semibold">Address</h3>
                <h3 className="font-semibold">Completed</h3>
                <h3 className="font-semibold">Department</h3>
                <h3 className="font-semibold">Acknowledge Time</h3>
                <h3 className="font-semibold">Created Time</h3>
                <h3 className="font-semibold">Resolved Time</h3>
              </div>

              {/* Tasks Data */}
              <div className="tasks-information overflow-y-auto max-h-[430px] bg-white mt-4 rounded-lg shadow-2xl">
                {tasks && tasks.length > 0 ? (
                  tasks.map((task, index) => (
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
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Reports;


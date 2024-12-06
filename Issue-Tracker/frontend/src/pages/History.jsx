import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Cookies from 'js-cookie';
import AlertBox from '../components/AlertBox'
import Footer from "../components/Footer";

function History(issues) {

  const [tasks, settasks] = useState([]);
  const [toResolvetasks, setToResolvetasks] = useState([]);
  const [hasChanged, setHasChanged] = useState(true);
  const [taskChanged, setTaskChanged] = useState(true);

  const navigate = useNavigate()

  // useEffect(() => {
  //   const accessToken = localStorage.getItem('accessToken'); 
  //   console.log("Before protected route");
  //   console.log(accessToken);


  //   axios.get('http://localhost:8000/api/v1/protected-route', {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,  
  //   }, 
  //     withCredentials: true })
  //     .then(response => {
  //       console.log('User is authenticated:', response.data);
  //     })
  //     .catch(error => {
  //       if (error.response && error.response.status === 401) {

  //         // Redirect to login page if unauthorized
  //         // const resetAction = NavigationActions.reset({
  //         //   index: 1,
  //         //   actions: [
  //         //     NavigationActions.navigate({ routeName: 'login' }),
  //         //     NavigationActions.navigate({ routeName: '' }),
  //         //   ]
  //         // });

  //         // this.props.navigation.dispatch(resetAction);
  //       }
  //       console.log("after protected route");

  //     });
  // }, [navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    axios.get('http://localhost:8000/api/v1/users/get-issue-for-user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true
    })
      .then((response) => {
        settasks(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [taskChanged]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    axios.get('http://localhost:8000/api/v1/users/get-issue', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }, withCredentials: true
    })
      .then((response) => {
        setToResolvetasks(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [hasChanged,taskChanged]);

  const handleComplete = async (taskId) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      await axios.post('http://localhost:8000/api/v1/users/complete-report', {
        issueId: taskId
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      setTaskChanged(!taskChanged);
    } catch (error) {
      e => { navigate("/") }
      console.error('Error completing the task:', error);
    }
  };


  const handleAcknowledge = async (taskId) => {
    const accessToken = localStorage.getItem('accessToken');

    console.log('Task ID:', taskId);
    
    try {
      await axios.post('http://localhost:8000/api/v1/users/acknowledge-time', {
        responseId: taskId
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }, withCredentials: true
      });

      setHasChanged(!hasChanged);

      AlertBox(1, "Problem acknowledged !!")
    } catch (error) {

      console.error('Error completing the task:', error);
    }
  };

  const navigateToAboutPage = () => {
    window.location.href = '/issue-form';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateToAboutPage();
  };

  return (
    <>
      <div className="issue-history">

        <Header />
        <main className="p-6 max-sm:p-2">
          <section className="text-center mb-10 max-sm:mb-6">
            <h2 className="text-3xl font-semibold text-gray-800 max-sm:text-2xl">History</h2>
          </section>

          <div className="flex flex-col lg:flex-row lg:space-x-6 justify-center items-start">

            {/* Issues to be Resolved */}
            <div className="lg:w-1/2 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 mb-6 lg:mb-0 max-sm:p-2 max-sm:mb-4">
              <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:text-center max-sm:px-2">
                Issues to Be Resolved
              </h3>
              <div className="max-h-[26rem] overflow-y-auto p-4 max-sm:p-2">
                {toResolvetasks.length > 0 ? (
                  <ul className="space-y-4 max-sm:space-y-2">
                    {toResolvetasks.map((task) => (
                      <li key={task.id} className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2">
                        <div className="flex justify-between items-center max-sm:flex-col">
                          <div className="text-left max-sm:mb-2">
                            <h4 className="font-semibold text-lg max-sm:text-base text-left ">Problem: {task.issue}</h4>
                            <p className="text-gray-600 max-sm:text-sm text-left">Description: {task.description}</p>
                            <p className="text-gray-600 max-sm:text-sm text-left">Address: {task.address}</p>
                            {/* <p>{task.acknowledge_at}</p> */}
                          </div>
                          {(task.acknowledge_at === null) && (
                              <button
                                onClick={() => handleAcknowledge(task.id)}
                                className="bg-green-500 text-white text-base px-4 py-2 rounded-lg hover:bg-green-600 max-sm:px-2 max-sm:py-1 "
                              >
                                Acknowledge
                              </button>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 max-sm:text-sm">No tasks to resolve.</p>
                )}
              </div>
            </div>

            {/* Issues Raised by Me */}
            <div className="lg:w-1/2 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-sm:p-2">
              <h3 className="text-xl font-semibold bg-indigo-100 text-indigo-700 py-2 px-4 rounded-t-lg max-sm:text-lg max-sm:text-center max-sm:px-2">
                Issues Raised By Me
              </h3>
              <div className="max-h-[28rem] overflow-y-auto p-4 max-sm:p-2">
                {tasks.length > 0 ? (
                  <ul className="space-y-4 max-sm:space-y-2">
                    {tasks.map((task) => (
                      <li key={task.id} className="bg-gray-100 p-4 rounded-lg shadow max-sm:p-2">
                        <div className="flex justify-between items-center max-sm:flex-col">
                          <div className="max-sm:mb-2">
                            <h4 className="font-semibold text-lg max-sm:text-base text-left">Task: {task.issue}</h4>
                            <p className="text-gray-600 max-sm:text-sm text-left ">Description: {task.description}</p>
                          </div>
                          <button
                            onClick={() => handleComplete(task.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 max-sm:px-2 max-sm:py-1"
                          >
                            Completed
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 max-sm:text-sm">No issues raised by you.</p>
                )}
              </div>
            </div>
          </div>
        </main>
        
      </div>
      
    </>
  );
};

export default History;


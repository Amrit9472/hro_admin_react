import React, { useState, useEffect, useContext } from 'react'
import { getlistOfEmpIntSchedule, hrResponseSubmit, getEmployeeDetails } from './services/EmployeeServiceJWT';
import { useUser } from './auth/UserContext';
import { format } from 'date-fns';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../components/auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './HrInterviewResponse.css';
import NotificationIcon from '../components/NotificationIcon'
function HrInterviewResponse({ role, name }) {
  const [employees, setEmployees] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  // const [sortOrder, setSortOrder] = useState('asc');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(5);
  const [responseError, setResponseError] = useState('');
  const [profileScreenRemarks, setProfileScreenRemarks] = useState({});
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [messageTimeoutId, setMessageTimeoutId] = useState(null);


  useEffect(() => {
    getAllEmployees();
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(intervalId);
    // }, [filterDate, sortOrder, currentPage, employees]);
  }, [filterDate, employees]);


  function getAllEmployees() {
    getlistOfEmpIntSchedule()

      .then((response) => {
        let filteredEmployees = response.data;
        if (filterDate) {
          filteredEmployees = filteredEmployees.filter(emp => new Date(emp.creationDate).toISOString().slice(0, 10) === filterDate.toISOString().slice(0, 10));
        }
        // filteredEmployees.sort((a, b) => {
        //   if (sortOrder === 'asc') {
        //     return new Date(a.creationDate) - new Date(b.creationDate);
        //   } else {
        //     return new Date(b.creationDate) - new Date(a.creationDate);
        //   }
        // });
        setEmployees(filteredEmployees);
      })
      .catch(error => {
        console.error('Error fetching employees:', error.message);
      });
  };

  const handleFilterChange = (e) => {
    const date = e.target.valueAsDate;
    setFilterDate(date);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };

  // const toggleSortOrder = () => {
  //   setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  // };

  const handleHrResponse = (e, employeeId) => {
    const selectedValue = e.target.value;
    console.log('Selected Response:', selectedValue);
    setSelectedResponse(prevSelectedResponse => ({
      ...prevSelectedResponse,
      [employeeId]: selectedValue
    }));
  };
  const handleRemarksChange = (e, employeeId) => {
    const profileScreenRemark = e.target.value;
    setProfileScreenRemarks((prevRemarks) => ({
      ...prevRemarks,
      [employeeId]: profileScreenRemark
    }));
  };


  const handleHrResponseValue = (employeeId) => {
    const selectedValue = selectedResponse[employeeId];
    const profileScreenRemark = profileScreenRemarks[employeeId];

    // if (!selectedValue || !profileScreenRemark) {
    //   setResponseError('Please fill all required fields');
    //   setSuccessMessage('');
    //   return;
    // }

    // Clear any existing timeout
    if (messageTimeoutId) {
      clearTimeout(messageTimeoutId);
    }

    hrResponseSubmit(employeeId, selectedValue, name, profileScreenRemark)
      .then(response => {
        setEmployees(prevEmployees =>
          prevEmployees.map(emp =>
            emp.id === employeeId ? response.data : emp
          )
        );
        setSuccessMessage('Response submitted successfully!');
        setResponseError('');
        const timeoutId = setTimeout(() => {
          setSuccessMessage('');
        }, 2000); // Hide success message after 2 seconds
        setMessageTimeoutId(timeoutId);
      })
      //   .catch(error => {
      //     console.error('Error submitting HR response:', error);
      //     setResponseError('Failed to submit response. Please try again.');
      //     setSuccessMessage('');
      //     const timeoutId = setTimeout(() => {
      //       setResponseError('');
      //     }, 2000); 
      //     setMessageTimeoutId(timeoutId);
      //   });
      // };
      .catch(error => {
        console.error('Error submitting HR response:', error);
        console.log('Error response:', error.response);
        if (error.response && error.response.data) {
          setResponseError(error.response.data); 
        } else {
          setResponseError('Failed to submit response. Please try again.');
        }
        setSuccessMessage('');
        const timeoutId = setTimeout(() => {
          setResponseError('');
        }, 2000); 
        setMessageTimeoutId(timeoutId);
      });
  };
  const showEmployeeDetails = (employeeId) => {
    getEmployeeDetails(employeeId)
      .then((response) => {
        if (response.data.length > 0) {
          const employeeDetails = response.data[0];
          console.log('Employee Details:', employeeDetails);
          setSelectedEmployeeDetails(employeeDetails);
          setShowDetailsModal(true); // Show modal when details are fetched
        } else {
          console.error('Employee not found');
          setSelectedEmployeeDetails(null);
          setShowDetailsModal(false);
        }
      })
      .catch(error => {
        console.error('Error fetching employee details:', error);
        setSelectedEmployeeDetails(null);
        setShowDetailsModal(false);
      });
  };

  const closeModal = () => {
    setShowDetailsModal(false);
  };


  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // const handleItemsPerPageChange = (e) => {
  //   const newItemsPerPage = parseInt(e.target.value, 10);
  //   setItemsPerPage(newItemsPerPage);
  //   setCurrentPage(1);
  // };


  const updateDateTime = () => {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(now);
    setCurrentDateTime(formattedDateTime);
  };
  const columns = [
    {
      name: 'Name',
      selector: row => row.fullName,
      cell: row => <button className="btn btn-link" onClick={() => showEmployeeDetails(row.id)}>{row.fullName}</button>,
      sortable: true,

    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,

    },
    // {
    //   name: 'Applied for',
    //   selector: row => row.jobProfile,

    // },
    {
      name: 'Mobile No',
      selector: row => row.mobileNo,

    },
    {
      name: 'Permanent Address',
      selector: row => row.permanentAddress,

    },
    {
      name: 'Gender',
      selector: row => row.gender
    },
    {
      name: 'Register Date',
      selector: row => new Date(row.creationDate).toLocaleDateString(),

    },
    {
      name: 'Remarks',
      selector: row => (
        <input
          type="text"
          className="form-control"
          value={profileScreenRemarks[row.id] || ''}
          onChange={(e) => handleRemarksChange(e, row.id)}
          placeholder="Enter remarks"
        />
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <select className='form-select' value={selectedResponse[row.id] || ''}
            onChange={(e) => handleHrResponse(e, row.id)}>
            <option value="" disabled>Choose</option>
            <option value="Select">Select</option>
            <option value="Reject">Reject</option>
          </select>

        </div>
      ),
    },
    {
      name: 'Action',
      selector: row => <button className="btn btn-outline-info mt-2" onClick={() => handleHrResponseValue(row.id)}>Submit</button>,
    }

  ];
  const handleLogout = (e) => {
    e.preventDefault();
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
      navigate('/');
    }
  };
  return (
    <>
      <div className="header">
        <span className="pe-3">{currentDateTime}</span>
        <NotificationIcon />
        <Link className="logout-btn" onClick={handleLogout}><i class="fas fa-power-off"></i></Link>
      </div>
      <div className='container'>
        <h2 className='text-center'></h2>
        {responseError && <div className="alert alert-danger">{responseError}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Success message */}
        <br />

        <div className="row mb-3">
          <div className="col-auto">
            <label htmlFor="filterDate" className="col-form-label">Filter by Date:</label>
          </div>
          <div className="col-auto">
            <input type="date" id="filterDate" className="form-control" onChange={handleFilterChange} value={filterDate ? filterDate.toISOString().split('T')[0] : ''} />
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-info" onClick={clearFilter}>Clear Filter</button>
          </div>
          {/* <div className="col-auto">
          <button className="btn btn-outline-info" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? 'Sort Desc' : 'Sort Asc'}
          </button>
        </div> */}
        </div>

        <DataTable
          columns={columns}
          data={employees}
          pagination
          paginationPerPage={7}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          paginationComponentOptions={{ noRowsPerPage: true }}
          striped

          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#1C3657',
              }
            },
            table: {
              style: {
                border: '1px solid #ddd',
                width: '1600px'
              }
            },
            headCells: {
              style: {
                color: 'white',
                fontSize: '11px'
              }
            }
          }}
        />

        {selectedEmployeeDetails && (
          <div className="modal" style={{ display: showDetailsModal ? 'block' : 'none' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-center">Employee Details:</h5>
                </div>
                <div className="modal-body">
                  <table>
                    <tr>
                      <th>Full Name</th>
                      <td>{selectedEmployeeDetails.fullName}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{selectedEmployeeDetails.email}</td>
                    </tr>
                    <tr>
                      <th>Aadhar Number</th>
                      <td>{selectedEmployeeDetails.aadhaarNumber}</td>
                    </tr>
                  </table>
                  <hr />
                  {selectedEmployeeDetails.statusHistories && selectedEmployeeDetails.statusHistories.map((history, index) => (
                    <div key={index}>
                      <p><strong>Status: </strong><span className="status" data-status={history.status}>{history.status}</span></p>
                      {history.hrName && <p><strong> Updated By: </strong>{history.hrName}</p>}
                      <p><strong>Changes Date Time: </strong>{format(new Date(history.changesDateTime), 'yyyy-MM-dd HH:mm:ss')}</p>
                      <hr />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-primary" onClick={closeModal}>Close</button>
                </div>
              </div>
            </div>
          </div>

        )}
      </div>
    </>
  );

};

export default HrInterviewResponse







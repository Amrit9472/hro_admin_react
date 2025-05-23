import axios from "axios";
const REST_API_BASE_URL = 'http://localhost:8080/api/employees';
const maendpoint = 'managerResponeField';
const hdfcendpoint = 'managerHdfcResponeField';
const iciciendpoint = 'managerIciciResponeField';
const misendpoint   ='managerMisResponeField';
const empDetailsInfoEndpoint = 'empDetailsInfo';
const approvedendpoint   = 'approvedEmpdetails';
const rejectedEmpdetails = 'rejectedEmpdetails';
const empIntScheduleEndpoint = 'employees-schedule-interview';
const hrRejectEmployeEndPoint = 'hrRejectedEmpDetails';
const processNameEndpoint = 'admin/get-process-name';
const searchByNameAPI ='searchByNameAPI';
const reportEndpoint = '/reportData'; 
const seqReportEndPoint ='/export';


const axiosInstance = axios.create({
    baseURL: REST_API_BASE_URL,
  })


  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; 
};

  const authConfig = () => {
    const token = localStorage.getItem('token');
    return{
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

  export const listEmployees = (token) => {
    return axiosInstance.get('/getAllEmp', authConfig());
  };

  export const selectInterviewProcess = (employeeId, interviewData) => {
    const token = localStorage.getItem('token');
    return axiosInstance.post(`${REST_API_BASE_URL}/${employeeId}/interview-process`, interviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  export const ReInterviewProcess = (employeeId, interviewData) => {
    const token = localStorage.getItem('token');
    return axiosInstance.post(`${REST_API_BASE_URL}/${employeeId}/reinterview-process`, interviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  export const getlistOfEmpIntSchedule = () => {
    return axiosInstance.get(`/${empIntScheduleEndpoint}`, authConfig());
  };
  export const getlistOfManagerResponeField = () => {
    return axiosInstance.get(`/${maendpoint}`, authConfig());
  };
  
  export const getlistOfManagerHdfcResponeField = () => {
    return axiosInstance.get(`/${hdfcendpoint}`, authConfig());
  };
  export const getlistOfManagerIciciResponeField = () => {
    return axiosInstance.get(`/${iciciendpoint}`, authConfig());
  };
  export const getlistOfManagerMisResponeField = () => {
    return axiosInstance.get(`/${misendpoint}`, authConfig());
  };
  export const getListOfProcessNameFrom = () =>{
    return axiosInstance.get(`/${processNameEndpoint}`, authConfig());
  }
  // export const getListOfManagerResponseFieldOnRole = (role) => {
  //   return axiosInstance.get(`/getAllEmployeeOnManagersPage/${role}`, authConfig());
  // };
  export const getListOfManagerResponseFieldOnRole = (process) => {
    return axiosInstance.get(`/getAllEmployeeOnManagersPage/${process}`, authConfig());
  };

  export const getlistOfApprovedEmpList = () =>{
    return axiosInstance.get(`/${approvedendpoint}`, authConfig());
  }
  export const getlistOfRejectedEmpList = () => {
    return axiosInstance.get(`/${rejectedEmpdetails}`, authConfig());
  }

  export const gethrRejectedEmpList = () => {
    return axiosInstance.get(`/${hrRejectEmployeEndPoint}`, authConfig());
  }
  export const getEmployeeDetails = (employeeId) => {
    return axiosInstance.get(`/${empDetailsInfoEndpoint}/${employeeId}`, authConfig());
  };
  
  export const getAllSearchNameApi = () => {
   return  axiosInstance.get(`${REST_API_BASE_URL}/${searchByNameAPI}`,authConfig()); 
  }

  export const MrResponseSubmit = (employeeId, selectedResponse,mrUserName,managerRemarks,clientRound) => {
    const url = `${REST_API_BASE_URL}/${employeeId}/mRResponse`;
    const data = { newStatus: selectedResponse,
                   mrUserName: mrUserName ,
                   managerRemarks:managerRemarks , 
                   clientRound:clientRound             
    };
    return axios.put(url, data, authConfig()); 
  };

  export const hrResponseSubmit = (employeeId, selectedResponse,hrUserName,profileScreenRemark) => {
    const url = `${REST_API_BASE_URL}/${employeeId}/hrResponse`;
    const data = { 
      newStatus: selectedResponse,
      hrUserName:hrUserName,
      profileScreenRemark:profileScreenRemark
    };
  
    return axios.put(url, data, authConfig());
  };

  export const updateEmployeeHrRejectedScreeningResponse = (employeeId , selectedResponse ,userName) => {
    const url = `${REST_API_BASE_URL}/${employeeId}/rejectByhrReInterviewSchedule`;
    const data = {
      newStatus: selectedResponse,
      userName:userName
    };
    return axios.put(url, data, authConfig());
  };


  export const downloadEmployeeReport = (startDate, endDate) => {
    return axiosInstance.get(reportEndpoint, {
      params: {
        startDate,
        endDate,
      },
      responseType: 'arraybuffer', // Important to handle binary data like Excel files
      ...authConfig(), // Include the token in the request headers
    });
  };


  export const downloadSequentialEmployeeReport = (startDate, endDate) => {
    return axiosInstance.get(seqReportEndPoint,{
      params: {
        startDate,
        endDate,
      },
      responseType: 'arraybuffer',
      ...authConfig(),
    });
  };
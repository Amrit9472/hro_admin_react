import axios from "axios";


class UsersService{
    static BASE_URL = "http://localhost:8080"

    static async login(email, password) {
        try {
            const response = await axios.post(`${UsersService.BASE_URL}/auth/login`, { email, password });     
            console.log('UserService Page Response data for checking:', response.data);
            const { token, role, name, process,email: userEmail} = response.data;
            if (token) {
                localStorage.setItem('token', token);
            } else {
                console.warn('Token field is missing in response data.');
            }
    
            if (role) {
                localStorage.setItem('role', role);
            } else {
                console.warn('Role field is missing in response data.');
            }
    
            if (name) {
                localStorage.setItem('name', name);
            } else {
                console.warn('Name field is missing in response data.');
            }
    
            if (process) {
                localStorage.setItem('process', process);
            } else {
                console.warn('Process field is missing in response data.');
            } 
            if (userEmail) {
                localStorage.setItem('email', userEmail);
                
            } else {
                console.warn('Email field is missing in response data.');
            }
            console.log("email----" ,userEmail);
            return { token, role, name, process, email: userEmail};
        } catch (err) {
            // Log the error and rethrow it
            console.error('Error during login:', err);
            throw err;
        }
    }

    

    static async register(userData,token){
        try{
            const response = await axios.post(`${UsersService.BASE_URL}/auth/register`,userData,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }


    static async changePassword(userData) {
        // Assuming no specific token is needed for password change
        try {
            const response = await axios.post(`${UsersService.BASE_URL}/auth/change-password`, userData);
            return response.data; // Return the response data from the backend
        } catch (err) {
            throw err; // Propagate the error to be handled where the function is called
        }
    }

    
    static async getAllUsers(token){
        try{
            const response = await axios.get(`${UsersService.BASE_URL}/admin/get-all-users`,userData,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async getYourProfile(token){
        try{
            const response = await axios.get(`${UsersService.BASE_URL}/adminuser/get-profile`,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            // console.log('API Response:', response);
            return response.data;

        }catch(err){
            console.error('Error fetching profile:', err);
            throw err;
        }
    }

    static async getUSerById(userId,token){
        try{
            const response = await axios.get(`${UsersService.BASE_URL}/admin/get-user/${userId}`,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    
    static async deleteUSer(userId,token){
        try{
            const response = await axios.delete(`${UsersService.BASE_URL}/admin/delete/${userId}`,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async updateUSer(userId, userData ,token){
        try{
            const response = await axios.delete(`${UsersService.BASE_URL}/admin/delete/${userId}`,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }
    static async getAllProcessNames(token) {
        try {
            const response = await axios.get(`${UsersService.BASE_URL}/admin/get-process-name`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching process names:', err);
            throw err;
        }
    }

    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token =  localStorage.getItem('token') 
        return !! token
    }

    static isAdmin(){
        const role =  localStorage.getItem('role') 
        return role === 'ADMIN'
    }
    static getRole() {
        return localStorage.getItem('role');
    }
    static getName() {
        return localStorage.getItem('name');
      }
      static getProcess(){
        return localStorage.getItem('process');
    }
    static getEmail(){
        return localStorage.getItem('email')
    }
    static isUser(){
        const role =  localStorage.getItem('role')
        return role === 'USER'
    }
}

export default UsersService;
import React, { createContext, useState, useEffect } from 'react';
import UsersService from '../services/UsersService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UsersService.isAuthenticated());
    const [role, setRole] = useState(UsersService.getRole());
    const [name, setName] = useState(UsersService.getName());
    const [email, setEmail] = useState(UsersService.getEmail());
    const [process, setProcess] = useState(UsersService.getProcess() || '');

    
    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(UsersService.isAuthenticated());
            setRole(UsersService.getRole());
            setName(UsersService.getName());
            setProcess(UsersService.getProcess() || '');
            setEmail(UsersService.getEmail());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (token, role, name, process, email) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        localStorage.setItem('process', process);
        localStorage.setItem('email', email);

        setIsAuthenticated(true);
        setRole(role);
        setName(name);
        setProcess(process);
        setEmail(email);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('process');
        localStorage.removeItem('email');

        UsersService.logout();
        setIsAuthenticated(false);
        setRole(null);
        setName(null);
        setProcess(null);
        setEmail(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, name, process, login, logout, email }}>
            {children}
        </AuthContext.Provider>
    );
};

import React, { useState } from 'react';
import UsersService from '../services/UsersService';
import { useNavigate, Link } from 'react-router-dom';
import './ResetPasswordPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordPage = ({ email, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleChangePassword = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        setMessage('');
        setError('');

        try {
            console.log('Calling UsersService.changePassword');
            const response = await UsersService.changePassword({
                email,
                oldPassword,
                newPassword,
                confirmPassword
            });
            console.log('Response:', response);
            if (response.message) {
                setMessage(response.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                console.log(response.message);
            } else {
                setError(response.error || 'Something went wrong. Please try again.');
                console.log("response message in else block", response.error);
            }
        } catch (error) {
            console.error('Caught error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <div className="reset-password-form">
                <span className="close-btn" onClick={onClose}>&times;</span>
                
                {message && (
                    <>
                        <p className="success-message">{message}</p>
                    </>
                )}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleChangePassword}>
                    <div className="form-group-reset">
                        <label>Old Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-reset">
                        <label>New Password</label>
                        <input
                            // type="password"
                            type={showNewPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="show-password-btn"
                        >
                            {/* {showNewPassword ? 'Hide' : 'Show'} */}
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="form-group-reset">
                        <label>Confirm Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control"
                            placeholder="Enter your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="show-password-btn"
                        >
                            {/* {showConfirmPassword ? 'Hide' : 'Show'} */}
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button type="submit" className="btn btn-primary">Change Password</button>
                </form>
            </div>
        </>
    );
};

export default ResetPasswordPage;

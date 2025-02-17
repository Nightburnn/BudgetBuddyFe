import React, { useState } from 'react';
import "./style/Settings.css"
const Settings = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [password, setPassword] = useState('Sarahdaniel12#');
    const [confirmPassword, setConfirmPassword] = useState('Sarahdaniel12#');

    const handleSave = () => {
        if (password === confirmPassword) {
            setIsEditing(false);
            // Handle save logic here
        }
    };

    return (
        <div className="container mt-2">
            <div className="settings-card">
                <div className="settings-header">
                    <h2 className="settings-title">User Information</h2>
                    {!isEditing && (
                         <button
                         onClick={() => setIsEditing(true)}
                         className="btn edit-button  d-flex align-items-center gap-2"
                     >
                         
                         Edit
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M14.2069 4.5861L11.4144 1.79297C11.3215 1.70009 11.2113 1.62641 11.0899 1.57614C10.9686 1.52587 10.8385 1.5 10.7072 1.5C10.5759 1.5 10.4458 1.52587 10.3245 1.57614C10.2031 1.62641 10.0929 1.70009 10 1.79297L2.29313 9.50047C2.19987 9.593 2.12593 9.70313 2.0756 9.82448C2.02528 9.94584 1.99959 10.076 2.00001 10.2073V13.0005C2.00001 13.2657 2.10536 13.52 2.2929 13.7076C2.48043 13.8951 2.73479 14.0005 3 14.0005H5.79313C5.9245 14.0009 6.05464 13.9752 6.17599 13.9249C6.29735 13.8746 6.40748 13.8006 6.5 13.7073L14.2069 6.00047C14.2998 5.90761 14.3734 5.79736 14.4237 5.67602C14.474 5.55468 14.4999 5.42463 14.4999 5.29329C14.4999 5.16195 14.474 5.03189 14.4237 4.91055C14.3734 4.78921 14.2998 4.67896 14.2069 4.5861ZM5.79313 13.0005H3V10.2073L8.5 4.70735L11.2931 7.50047L5.79313 13.0005ZM12 6.79297L9.20688 4.00047L10.7069 2.50047L13.5 5.29297L12 6.79297Z" fill="#1A1A1A"/>
</svg>
                     </button>
                    )}
                </div>

                {!isEditing ? (
                    <div className=" setting-form form-group">
                        <label className="form-label">Password</label>
                        <div className="password-display">
                            {password}
                        </div>
                    </div>
                ) : (
                    <form>
                        <div className="form-group">
                            <label className="form-label">Enter Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="save-button"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Settings;
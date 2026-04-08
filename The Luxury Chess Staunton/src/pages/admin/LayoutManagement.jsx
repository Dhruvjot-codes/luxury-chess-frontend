import React, { useState } from "react";
import { settingsService } from "../../services/api";
import "./LayoutManagement.css";

const LayoutManagement = () => {
    const [uploading, setUploading] = useState(null); // 'explore' or 'about'
    const [status, setStatus] = useState("");

    const handleFileUpload = async (section, files) => {
        if (!files || files.length === 0) return;
        
        setUploading(section);
        setStatus("Uploading to secure server...");
        
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append("files", file);
        });

        try {
            await settingsService.updateSection(section, formData);
            setStatus(`Successfully updated ${section} section images!`);
            setTimeout(() => setStatus(""), 3000);
        } catch (err) {
            setStatus(`Error: ${err.message}`);
        } finally {
            setUploading(null);
        }
    };

    return (
        <div className="layout-management">
            <h2>Site Appearance & Sections</h2>
            <p className="helper-text">Update the images for the main page sections. Please upload exactly 2 images for each section to maintain the stacked design.</p>

            <div className="upload-grid">
                {/* EXPLORE COLLECTION SECTION */}
                <div className="upload-card">
                    <div className="card-icon">🏠</div>
                    <h3>Explore Collection (Hero)</h3>
                    <p>Change the two stacked images in the main hero section.</p>
                    <div className="file-input-wrapper">
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={(e) => handleFileUpload("explore", e.target.files)}
                            disabled={uploading === "explore"}
                        />
                        <button className="custom-file-btn">
                            {uploading === "explore" ? "Uploading..." : "Select 2 Images"}
                        </button>
                    </div>
                </div>

                {/* ABOUT US SECTION */}
                <div className="upload-card">
                    <div className="card-icon">ℹ️</div>
                    <h3>About Us Section</h3>
                    <p>Change the two stacked images in the About Us section.</p>
                    <div className="file-input-wrapper">
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={(e) => handleFileUpload("about", e.target.files)}
                            disabled={uploading === "about"}
                        />
                        <button className="custom-file-btn">
                            {uploading === "about" ? "Uploading..." : "Select 2 Images"}
                        </button>
                    </div>
                </div>
            </div>

            {status && (
                <div className={`status-msg ${status.includes('Error') ? 'error' : 'success'}`}>
                    {status}
                </div>
            )}
        </div>
    );
};

export default LayoutManagement;

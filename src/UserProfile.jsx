import axios from "axios";
import { useEffect, useState } from "react";
import './Homepage.css';
import { Link, useNavigate } from "react-router-dom";

export default function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newIntro, setNewIntro] = useState("");
    const [statusList, setStatusList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async() => {
            try {
                const response = await axios.get(`/api/user/userprofile`);
                setUserData(response.data);
            } catch(err) {
                setError("Failed to load user data");
            }
        }

        const fetchUserStatus = async() => {
            try{
                const statuses = await axios.get(`/api/status/getUserStatus`);
                setStatusList(statuses.data);
            } catch(err) {
                setError("Failed to load user's status data");
            }
        }
        fetchUserData();
        fetchUserStatus();
    }, []);

    const statusComponents = statusList.map(status => (
        <div key={status._id}>
            <div><strong>{status.username}</strong></div>
                <div>
                    <div>{status.statusText}</div>
                </div>
        </div>
    ));

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async() => {
        try{
            await axios.put(`/api/user/edit`, {intro: newIntro});
            setUserData((prev) => ({...prev, intro: newIntro}));
            setEditMode(false);
        } catch (err) {
            setError("Failed to save intro change");
        }
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>
    }

    return (
        <div>
                <nav className="navbar">
                <div className="navbar-left"> 
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/userprofile" className="navbar-link">UserProfile</Link>
                </div>

            </nav>
            <h1> {userData.username}'s Profile </h1>
            <p> Joined: {userData.created}</p>
            <div> 
                <h3>Introduction: </h3>
                {editMode ? (
                    <div>
                        <textarea value={newIntro}
                        onChange={(e) => setNewIntro(e.target.value)}
                        ></textarea>
                        <button onClick={handleSave}>Save</button>
                    </div>
                ) : (
                    <div>
                        <p>{userData.intro || "No Introduction provided."}</p>
                        <button onClick={handleEdit}>Edit</button>
                    </div>
                )}
            </div>
            {statusComponents}
        </div>
        
    )


}
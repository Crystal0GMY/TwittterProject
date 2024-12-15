import axios from "axios";
import { useEffect, useState } from "react";
import './Homepage.css';
import { Link, useNavigate } from "react-router-dom";

export default function Homepage() {
    const [statusList, setStatusListState] = useState([]);
    const [text, setTextState] = useState('');
    const [errorMsgState, setErrorMsgState] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [editText, setEditText] = useState('');
    const navigate = useNavigate();

    console.log("000")
    useEffect(() => {
        console.log("111")
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('/api/user/isLoggedIn');
                setCurrentUser(response.data);
                setIsLoggedIn(true);
                console.log(currentUser);
            } catch {
                setIsLoggedIn(false);
            }
        };
    
        fetchCurrentUser();
        getAllStatus()
    }, []);

    
    const logout = () => {
        document.cookie = 'statusToken=; Max-Age=0; path=/;'; // Clear token
        setIsLoggedIn(false);
        setCurrentUser(null);
        navigate('/');
      };

    async function getAllStatus() {
        const response = await axios.get('/api/status')

        setStatusListState(
            response.data
        )
    }

    async function updateStatus(statusId) {
        try {
            const response = await axios.put(`/api/status/edit/${statusId}`, { 
                statusText: editText 
            });

        console.log('Update response:', response);
    
            const updatedStatuses = statusList.map(status => 
                status._id === statusId 
                    ? {...status, statusText: editText} 
                    : status
            );
            setStatusListState(updatedStatuses);
            setEditingStatusId(null);
        } catch (error) {
            setErrorMsgState(error.response?.data || 'Failed to update status');
        }
    }

    const deleteStatus = async(id) => {
        try {
            await axios.delete(`/api/status/delete/${id}`);
            setStatusListState(statusList.filter(status => status._id !== id));
        } catch (error) {
            setErrorMsgState(error);
        }
    }


    const statusComponents = statusList.map(status => (
        <div key={status._id}>
            <div><strong>{status.username}</strong></div>
            {editingStatusId === status._id ? (
                <div>
                    <input 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Edit your status"
                    />
                    <button onClick={() => updateStatus(status._id)}>
                        Save
                    </button>
                    <button onClick={() => setEditingStatusId(null)}>
                        Cancel
                    </button>
                </div>
            ) : (
                <div>
                    <div>{status.statusText}</div>
                    {(isLoggedIn && currentUser === status.username) ? (
                        <button 
                            onClick={() => {
                                setEditingStatusId(status._id);
                                setEditText(status.statusText);
                            }}
                            className="edit-button"
                        >
                            Edit
                        </button>
                    ) : null}

                    {(isLoggedIn && currentUser === status.username) ? (
                        <button 
                            onClick={() => deleteStatus(status._id)}
                            className="edit-button"
                        >
                            Delete
                        </button>
                    ) : null}   
                </div>
            )}
        </div>
    ));

    
    
    function updateStatusText(event) {
        setTextState(event.target.value);
    }

    async function createNewStatus() {
        setErrorMsgState(null);

        const newStatus = {
            statusText: text,
        }

        if(!text) {
            setErrorMsgState('Please add valid text!')
            return;
        }

        try {
            await axios.post('/api/status', newStatus);
        } catch (error) {
            setErrorMsgState(error.response.data);
            return;
        }

        setTextState('');
        
        await getAllStatus();
    }

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-left"> 
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/userprofile" className="navbar-link">UserProfile</Link>
                </div>
                <div className="navbar-right">
                    {isLoggedIn ? (
                        <> 
                            <button onClick={logout} className="logoutButton">Log Out</button>
                        </>
                    ) :
                    (
                        <>
                            <Link to="/login" className="navbar-link">Log in</Link>
                            <Link to="/signup" className="navbar-link">Sign up</Link>
                        </>
                    )}
                </div>
            </nav>
      <h1>Welcome to Status Updates</h1>

      <h2>All Status Updates</h2>
      {statusComponents}

      {isLoggedIn ? (
        <div>
          <h2>Add a New Status</h2>
          {errorMsgState && <div className="errorMessage">ERROR: {errorMsgState}</div>}
          <input
            value={text}
            onChange={(e) => updateStatusText(e)}
            placeholder="What's on your mind?"
          />
          <button onClick={createNewStatus}>Post Status</button>
          
        </div>
      ) : (
        null
      )}
    </div>
    );

}
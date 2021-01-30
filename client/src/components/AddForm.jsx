import React,{useState} from 'react';
import axios from 'axios';
export default () => {
    const [user,setUser] = useState("");
    const [role,setRole] = useState("");
    const sendForm = () => {
        axios.post("http://localhost:5000/addRole",{
            "user":user,
            "role":role
        })
        .then(resp => console.log(resp))
        .catch(err => console.log(err));
    }
    return (
        <div className="form">
            <p>Add role to user (by id)</p>
            <div className="form-group">
                <label htmlFor="user">User:</label>
                <input onChange={e => setUser(e.target.value)} value={user} type="text" id="user"/>
            </div>
            <div className="form-group">
                <label htmlFor="role">Role:</label>
                <input onChange={e => setRole(e.target.value)} value={role} type="text" id="role"/>
            </div>
            <button onClick={() => sendForm()}>Submit</button>
        </div>
    );
}
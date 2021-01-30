import React,{useState,useEffect} from 'react';
// import {Router} from '@reach/router';
import axios from 'axios';
import "./main.css";
export default () => {
    const [user,setUser] = useState("");
    const [role,setRole] = useState("");
    const [filter,setFilter] = useState("a");
    const [allUsers,setAllUsers] = useState([]);
    const sendForm = () => {
        axios.post("http://localhost:5000/addRole",{
            "user":user,
            "role":role
        })
        .then(resp => console.log(resp))
        .catch(err => console.log(err));
    }
    const getUsers = type => {
        axios.get(`http://localhost:5000/filter${type}s/${filter}`)
        .then(resp => {
            setAllUsers(resp.data.members);
            console.log(resp.data.members);
        })
        .catch(err => console.log(err));
    }
    return (
        <div>
            <div className="form">
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
            <div className="form">
                <div className="form-group" >
                    <label htmlFor="filter-role">Find by role:</label>
                    <input onChange={e => setFilter(e.target.value)} value={filter} type="text" id="filter-role"/>
                </div>
                <button onClick={() => getUsers("Role")}>Get Users</button>
                <ul>
                    {allUsers && allUsers.map((u,i) => <li key={i}>{u.displayName}</li>)}
                </ul>
            </div>
            <div className="form">
                <div className="form-group" >
                    <label htmlFor="filter-name">Find by name:</label>
                    <input onChange={e => setFilter(e.target.value)} value={filter} type="text" id="filter-name"/>
                </div>
                <button onClick={() => getUsers("Name")}>Get Users</button>
                <ul>
                    {allUsers && allUsers.map((u,i) => <li key={i}>{u.displayName}</li>)}
                </ul>
            </div>
        </div>
    );
}
import React,{useState} from 'react';
import axios from 'axios';
export default ({type}) => {
    const [filter,setFilter] = useState("a");
    const [allUsers,setAllUsers] = useState([]);
    const getUsers = type => {
        axios.get(`http://localhost:5000/filter${type}s/${filter}`)
        .then(resp => {
            setAllUsers(resp.data.members);
            console.log(resp.data.members);
        })
        .catch(err => console.log(err));
    }
    return (
        <div className="form">
            <div className="form-group" >
                <label htmlFor="filter-role">Find by {type}:</label>
                <input onChange={e => setFilter(e.target.value)} value={filter} type="text" id="filter-role"/>
            </div>
            <button onClick={() => getUsers(type)}>Get Users</button>
            <ul>
                {allUsers && allUsers.map((u,i) => <li key={i}>{u.displayName}</li>)}
            </ul>
        </div>
    );
}
import React from 'react';
import "./main.css";
import FilterForm from '../components/FilterForm';
import AddForm from '../components/AddForm';
export default () => {
    return (
        <div>
            <AddForm />
            <FilterForm type="role"/>
            <FilterForm type="name"/>
        </div>
    );
}
import React from 'react';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const Filters = () => {
    const query = useQuery();

    console.log(query);

    return (
        <div>
            filters
        </div>
    );
};

import React from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';

const app = () => {
    return (
        <div className="container">
            <h1>Creat post</h1>
            <PostCreate />
            <hr />
            <h1>Posts List</h1>
            <PostList />
        </div>
    );
};

export default app;

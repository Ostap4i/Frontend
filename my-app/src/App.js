import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import PostGrid from './Games/postGrid';
import SingleCard from './Games/singleCard';
import CreatePost from './Games/createPost';
import UserPage from './Home/UserPage';
import EditPost from './Games/editPost';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<PostGrid />} />
                <Route path="/post/:id" element={<SingleCard />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/user/:id" element={<UserPage />} />
            </Routes>
        </Router>
    );
};

export default App;

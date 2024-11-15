import React, { useRef, useState, useEffect } from 'react';
import Auth from '../Auth/Auth';
import './Home.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const authRef = useRef();
    const isAuthorized = localStorage.getItem('userId');
    const [userInfo, setUserInfo] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0); 

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await fetch(`/api/v1/user/${userId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user info');
                    }
                    const data = await response.json();
                    setUserInfo(data);
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            }
        };

        const fetchTotalPosts = async () => {
            try {
                const response = await fetch('/api/v1/post/'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const posts = await response.json();
                setTotalPosts(posts.length);
            } catch (error) {
                console.error('Error fetching total posts:', error);
            }
        };

        fetchUserInfo();
        fetchTotalPosts();  
    }, [isAuthorized]);

    const handleRegisterClick = (event) => {
        event.preventDefault();
        authRef.current.showModal(false);
    };

    const handleRandomPostClick = () => {
        const randomId = Math.floor(Math.random() * totalPosts) + 1;  
        return `/post/${randomId}`;
    };

    return (
        <header className='myHeader'>
            <Link to='/' className='logo'>RateVerse</Link>
            <div className='links'>
                <Link to={handleRandomPostClick()} onClick={handleRandomPostClick}>Feeling Lucky</Link>
                <Link to='/'>Games</Link>
                <a href="#contacts">Contacts</a>
                {!isAuthorized && (
                    <a href="/" onClick={handleRegisterClick}>Register</a>
                )}
            </div>
            <div>
                {isAuthorized && userInfo && (
                    <Link to={`/user/${userInfo.id}`}>
                        <img
                            src={userInfo.image}
                            alt=""
                            className="user-avatar"
                        />
                    </Link>
                )}
            </div>
            <Auth ref={authRef} />
        </header>
    );
};

export default Header;

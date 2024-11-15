import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserPage.css';
import Header from './Header';
import Footer from './Footer';
import { Rate, message } from 'antd';
import PostGrid from '../Games/postGrid';

const UserPage = () => {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: '',
        image: '',
        rating: 0.0,
        description: '',
    });

    const userId = localStorage.getItem('userId');
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchUserInfo();

        if (userId || id) {
            fetchUserInfo();
        }
    }, [id, userId]);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`/api/v1/user/${id == null ? userId : id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            message.error('Failed to fetch user info');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let updatedUserInfo = { ...userInfo };

        const formData = new FormData();
        formData.append('name', updatedUserInfo.name);
        formData.append('password', updatedUserInfo.password);
        formData.append('description', updatedUserInfo.description);

        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        else{
            formData.append('image', updatedUserInfo.image);
        }

        try {
            const response = await fetch(`/api/v1/user/${userId}`, {
                method: 'PUT',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to update user info');
            }

            message.success('User info updated successfully');
        } catch (error) {
            message.error('Failed to update user info');
        }
        fetchUserInfo();
        setImageFile(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        window.location.href = '/';
    };

    return (
        <div>
            <Header />
            <div className="user-page">
                <main>
                    <h1>User Information</h1>
                    <div className="user-info">
                        <div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img
                                    src={userInfo.image}
                                    alt={`${userInfo.name}'s avatar`}
                                    className="ava"
                                />
                                {id == null || userId === id
                                    ? <div className="image-upload-section">
                                    <input
                                        type="text"
                                        name="image"
                                        placeholder="Enter image URL"
                                        value={userInfo.image}
                                        onChange={handleChange}
                                    />
                                    <input
                                        className='image-upload-input'
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                : null}
                                <div className='rating'>
                                    <Rate disabled value={userInfo.rating} />
                                </div>
                            </div>

                            <div>
                                {id == null || userId === id
                                    ? <form onSubmit={handleSubmit} className="user-form">
                                        <div className="form-group">
                                            <label htmlFor="name">Name:</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={userInfo.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">New Password:</label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={userInfo.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Description:</label>
                                            <textarea
                                                className='descriptionTxtArea'
                                                type="description"
                                                id="description"
                                                name="description"
                                                value={userInfo.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="submit-button">Update Info</button>
                                    </form>
                                    :
                                    <>
                                        <h1>{userInfo.name}</h1>
                                        <h2>{userInfo.description}</h2>
                                    </>
                                }
                            </div>
                        </div>
                        <div>
                            {id == null || userId === id ? <button onClick={handleLogout} className="logout-button">Logout</button> : null}
                        </div>
                    </div>
                </main>
            </div>
            <PostGrid userId={id} userName={userInfo.name} />
            <Footer />
        </div>
    );
};

export default UserPage;

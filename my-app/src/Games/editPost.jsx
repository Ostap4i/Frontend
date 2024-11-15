import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, message, Select, Spin } from 'antd';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import './games.css';

const { Option } = Select;

const EditPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(''); 
    const [genreId, setGenreId] = useState(null);
    const [genres, setGenres] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('/api/v1/genre/');
                if (!response.ok) {
                    throw new Error('Failed to fetch genres');
                }
                const data = await response.json();
                setGenres(data);
            } catch (error) {
                message.error('Error fetching genres: ' + error.message);
            }
        };
        fetchGenres();
    }, []);

    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/v1/post/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }
                const data = await response.json();
                setPost(data);
                setTitle(data.title);
                setContent(data.content);
                setImage(data.image);
                setGenreId(data.genre ? data.genre.id : null);
            } catch (error) {
                message.error(`Error fetching post: ${error.message || 'Please try again later.'}`);
            }
        };
        fetchPost();
    }, [id]);

    // Handle saving changes
    const handleSaveChanges = async () => {
        if (!title || !content || (!image && !selectedFile) || genreId === null) {
            message.error('Please fill in all fields');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('genreId', genreId);
        formData.append('userId', parseInt(userId, 10));
        formData.append('updatedAt', new Date().toISOString());

        if (selectedFile) {
            formData.append('imageFile', selectedFile);
        } else {
            formData.append('image', image); 
        }

        try {
            const response = await fetch(`/api/v1/post/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to update post: ${errorData.message || 'Unknown error'}`);
            }

            message.success('Post updated successfully');
            navigate(`/post/${id}`);
        } catch (error) {
            message.error(error.message);
        }
    };

    // Handle file change
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setImage(null);
    };


    if (!post) {
        return <Spin size="large" />;
    }

    return (
        <div>
            <Header />
            <div className='editPageContainer'>
                <h1>Edit Post</h1>
                <div className='editPostForm'>
                    <p className='editTitle'>Genre:</p>
                    <Select
                        placeholder="Select Genre"
                        value={genreId}
                        onChange={setGenreId}
                        style={{ width: '100%', marginBottom: '20px' }}
                    >
                        {genres.map((genre) => (
                            <Option key={genre.id} value={genre.id}>
                                {genre.name}
                            </Option>
                        ))}
                    </Select>
                    <p className='editTitle'>Title:</p>
                    <Input
                        placeholder='Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />

                    <p className='editTitle'>Discription:</p>
                    <Input.TextArea
                        placeholder='Content'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        style={{ marginBottom: '20px' }}
                    />

                    <p className='editTitle'>Image:</p>
                    <div className='imageInput'>
                        <Input
                            className='imageInput'
                            placeholder='Image URL'
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <div style={{ marginBottom: '20px' }}>
                            <input type="file" onChange={handleFileChange} />
                        </div>
                    </div>

                    <Button className='submitBtn' type="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </div>
                <Button
                    type="default"
                    className='backBtn'
                    onClick={() => navigate(-1)}
                    style={{ marginTop: '20px' }}
                >
                    Back
                </Button>
            </div>
            <Footer />
        </div>
    );
};

export default EditPost;

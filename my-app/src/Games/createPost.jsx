import React, { useState, useEffect } from 'react';
import { Input, Button, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import './games.css';

const { Option } = Select;

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [description, setDescription] = useState('');
    const [imgUrl, setImgUrl] = useState(null);
    const [imgFile, setImgFile] = useState(null); 
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('/api/v1/genre/');
                const data = await response.json();
                setGenres(data);
            } catch (error) {
                message.error('Error fetching genres: ' + error.message);
            }
        };

        fetchGenres();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            setImgUrl(null);
        }
    };

    const handleSubmit = async () => {
        if (!title || !genre || !description || (!imgUrl && !imgFile)) {
            message.error('Please fill in all fields');
            return;
        }
    
        const userId = localStorage.getItem('userId');
    
        const formData = new FormData();
        formData.append('userId', parseInt(userId, 10));
        formData.append('title', title);
        formData.append('content', description);
        formData.append('genreId', parseInt(genre, 10));

        if (imgFile) {
            formData.append('imageFile', imgFile);
        } else if (imgUrl) {
            formData.append('image', imgUrl);
        }
    
        setLoading(true);
    
        try {
            const response = await fetch('/api/v1/post/', {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
    
            const result = await response.json();
            if (result) { 
                message.success('Post created successfully');
                navigate(`/post/` + result.message); 
            }
        } catch (error) {
            message.error('Error creating post: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <Header />
            <div className='createPost'>
                <div className='createPostContainer'>
                    <h1>Create Post</h1>
                    <p className='editTitle'>Genre:</p>
                    <Select
                        placeholder="Select Genre"
                        value={genre}
                        onChange={setGenre}
                        style={{ width: '50%', marginBottom: '10px' }}
                    >
                        {genres.map((g) => (
                            <Option key={g.id} value={g.id}>
                                {g.name}
                            </Option>
                        ))}
                    </Select>

                    <p className='editTitle'>Title:</p>
                    <Input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                   
                    <p className='editTitle'>Description:</p>
                    <Input.TextArea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        style={{ marginBottom: '10px' }}
                    />
                    
                    <div className="image-upload-section">
                        <p className='editTitle'>Image:</p>
                        <Input
                            placeholder="Image URL"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            style={{ marginBottom: '10px', width: '75%' }}
                        />
                        <input 
                            type="file" 
                            accept="image/*,video/mp4, video/mov, video/webm"
                            onChange={handleFileChange} 
                            style={{ marginLeft: '10px', display: 'inline-block', width: '75%' }} 
                        />
                    </div>
                    
                    <div className='buttons'>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            style={{ marginRight: '10px' }}
                            className='createPostBtn'
                            loading={loading}
                        >
                            Submit
                        </Button>
                        <Button
                            type="default"
                            onClick={() => navigate(-1)}
                            className='backBtn'
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CreatePost;

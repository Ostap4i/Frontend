import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './games.css';
import { Rate } from 'antd';
import MediaComponent from './mediaComponent';

const PostItem = ({ id, imgSrc, title, genre, description, rating, authorName, createdAt, authorId }) => {
    const [authorImg, setAuthorImg] = useState('');
    const [mediaType, setMediaType] = useState('');

    useEffect(() => {
        const fetchAuthorImg = async () => {
            try {
                const response = await fetch(`/api/v1/post/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch post details');
                }
                const data = await response.json();
                setAuthorImg(data.user.image);
            } catch (error) {
                console.error('Error fetching author image:', error);
            }
        };

        fetchAuthorImg();
    }, [id]);
    
    useEffect(() => {
        const determineMediaType = (fileName) => {
            const extension = fileName.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
            if (['mp4', 'mov', 'webm'].includes(extension)) return 'video';
            if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
            if (extension === 'pdf') return 'pdf';
            return 'unknown';
        };

        setMediaType(determineMediaType(imgSrc));
    }, [imgSrc]);

    return (
        <div>
            <Link style={{ textDecoration: 'none' }} to={`/post/${id}`}>
                <div className="card">
                    <div>
                        <div>
                            <div className='postAuthor'>
                                <Link className='postAuthorLink'to={`/user/${authorId}`}>
                                    <img src={authorImg} alt="" className='postAuthorPic' />
                                    <p className='postUserName'>
                                        <b>{authorName}</b>
                                    </p>
                                </Link>

                                <p className='postDate'>
                                    {new Date(createdAt).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <MediaComponent mediaType={mediaType} mediaSrc={imgSrc} className="PostItem"/>
                        </div>
                    </div>
                    <div className="card-details">
                        <h2>{title}</h2>
                        <Rate disabled value={rating} />
                        <p className="genre">{genre}</p>
                        <p>{description}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PostItem;

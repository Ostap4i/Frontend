import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { Input, Button } from 'antd';
const { Search } = Input;

const Tools = ({ onSortChange, onSearchChange, activeSort }) => {
    const navigate = useNavigate();
    const isAuthorized = !!localStorage.getItem('userId');

    return (
        <div className='myTools'>
            {isAuthorized && (
                <div className='addPost'>
                    <Button
                        type="primary"
                        onClick={() => navigate('/create-post')}
                        className='addPostBtn'>                            
                        Add Post
                    </Button>
                </div>
            )}
            <div className='search'>
                <Search
                    placeholder="Input search text..."
                    onSearch={onSearchChange}
                    enterButton
                    onChange={e => onSearchChange(e.target.value)}
                />
            </div>
            <div className='sort'>
                <Button
                    className={`sortBtn ${activeSort === 'date' ? 'active' : ''}`}
                    type="primary"
                    onClick={() => onSortChange('date')}>
                    Sort by Date
                </Button>
                <Button
                    className={`sortBtn ${activeSort === 'rating' ? 'active' : ''}`}
                    type="primary"
                    onClick={() => onSortChange('rating')}>
                    Sort by Rating
                </Button>
                <Button
                    className={`sortBtn ${activeSort === 'genre' ? 'active' : ''}`}
                    type="primary"
                    onClick={() => onSortChange('genre')}>
                    Sort by Genre
                </Button>
                <Button
                    className={`sortBtn ${activeSort === 'name' ? 'active' : ''}`}
                    type="primary"
                    onClick={() => onSortChange('name')}>
                    Sort by Name
                </Button>
            </div>
        </div>
    );
}

export default Tools;

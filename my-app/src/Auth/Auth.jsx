import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Registration from './Registration';
import Login from './Login';
import './Form.module.css';

const Auth = forwardRef((_, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        
        const userId = localStorage.getItem('userId');
        if (userId) {
            setIsAuthorized(true);
        }
    }, []);

    const showModal = (isLogin) => {
        setIsLoginForm(isLogin);
        setIsModalOpen(true);
    };

    useImperativeHandle(ref, () => ({
        showModal,
    }));

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
    };

    return (
        <>
           
            {!isAuthorized && (
                <Button
                    className="authBtn"
                    type="primary"
                    shape="circle"
                    onClick={() => showModal(true)}
                    icon={<UserOutlined style={{ color: '#222831' }} />}
                    style={{ backgroundColor: '#9B3922' }}
                />
            )}

            <Modal
                open={isModalOpen}
                footer={null}
                onCancel={() => setIsModalOpen(false)}
                style={{ backgroundColor: '#222831', color: '#ffffff', borderRadius: '8px', padding: '0px' }}
            >
                {isLoginForm ? <Login toggleForm={toggleForm} /> : <Registration toggleForm={toggleForm} />}
            </Modal>
        </>
    );
});

export default Auth;

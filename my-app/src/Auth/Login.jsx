import { Formik, Field, Form, ErrorMessage } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import styles from './Form.module.css';
import { message } from 'antd';

const initialValues = {
    name: '',
    password: '',
};

const LoginSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    password: Yup.string().min(3).max(20).required('Password is required'),
});

const submitHandler = async (values, formikBag) => {
    
    const loginData = {
        name: values.name,
        password: values.password,
    };

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        const data = await response.json();

        if (data.success) {
            message.success('Login successful!');
            localStorage.setItem('userId', data.userId);
            window.location.reload();

        } else {
            message.error('Invalid credentials!');
        }
    } catch (error) {
        message.error('An error occurred. Please try again later.');
    }

    formikBag.resetForm();
};

const Login = ({ toggleForm }) => {
    return (
        <div className={styles.loginForm}>
            <h2>Login</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                validationSchema={LoginSchema}
            >
                {() => (
                    <Form>
                        <div className={styles.field}>
                            <Field
                                name="name"
                                type="text"
                                placeholder="Name"
                                className={styles.input}
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className={styles.invalid}
                            />
                        </div>

                        <div className={styles.field}>
                            <Field
                                name="password"
                                type="password"
                                placeholder="Password"
                                className={styles.input}
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className={styles.invalid}
                            />
                        </div>

                        <div className={styles.buttonGroup}>
                            <button type="submit" className={styles.button}>
                                Submit
                            </button>
                        </div>

                        <div className={styles.footer}>
                            <p>Don't have an account?</p>
                            <button type="button" onClick={toggleForm} className={styles.linkButton}>
                                Register
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;

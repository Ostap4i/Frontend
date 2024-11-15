import { Formik, Field, Form, ErrorMessage } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom'; 
import styles from './Form.module.css';

const initialValues = {
    name: '',
    password: '',
};

const RegistrationSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too short").max(50, "Too long").required("Name is required!"),
    password: Yup.string().min(4).max(20).required("Password is required!"),
});

const Registration = ({ toggleForm }) => {
    const navigate = useNavigate();

    const submitHandler = async (values, formikBag) => {
        try {
            const response = await fetch('/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (data.success) {            
                localStorage.setItem('userId', data.userId);                
                navigate(`/user/${data.userId}`);
            } else {
                console.error("Registration failed:", data.message);
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            console.error("An error occurred during registration:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className={styles.registrationForm}>
            <h2>Registration</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                validationSchema={RegistrationSchema}
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
                            <p>Already have an account?</p>
                            <button type="button" onClick={toggleForm} className={styles.linkButton}>
                                Login
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Registration;

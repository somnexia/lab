import React, { Component } from 'react';
import { MdOutlineHexagon } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import axios from 'axios';

class SignUp extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
        errorMessage: '',
        successMessage: '',
    };

    handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        this.setState({ [name]: type === 'checkbox' ? checked : value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { name, email, password, confirmPassword, termsAccepted } = this.state;

        // Проверка согласия с условиями
        if (!termsAccepted) {
            this.setState({ errorMessage: 'You must accept the terms and privacy policy' });
            return;
        }

        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            this.setState({ errorMessage: 'Passwords do not match' });
            return;
        }

        try {
            // Отправка данных на сервер
            const response = await axios.post('http://localhost:3000/api/users', {
                name,
                email,
                password,
            });

            this.setState({
                successMessage: 'Registration was successful!',
                errorMessage: '',
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                termsAccepted: false,
            });
        } catch (error) {
            this.setState({
                errorMessage: error.response?.data?.error || 'Registration error',
                successMessage: '',
            });
        }
    };

    render() {
        const { name, email, password, confirmPassword, termsAccepted, errorMessage, successMessage } = this.state;

        return (
            <div className='container' data-theme="light">
                <div className='justify-content-center align-items-center min-vh-100 py-5 row'>
                    <div className='col-xl-5 col-xxl-3 col-lg-5 col-md-8 col-sm-10'>
                        <form onSubmit={this.handleSubmit}>
                            <Link className="d-flex justify-content-center text-decoration-none mb-4" to="/">
                                <div className="fw-bolder fs-5 d-inline-block d-flex align-items-center">
                                    <MdOutlineHexagon className="auth logo" />
                                </div>
                            </Link>
                            <div className="text-center mb-7">
                                <h3 className="text-body-highlight">Sign Up</h3>
                                <p className="text-body-tertiary">Create your account today</p>
                            </div>

                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                            <button type="button" className="w-100 mb-3 btn btn-secondary ">
                                <span className='nav-link-icon'>
                                    <FaGoogle />
                                </span>
                                <span>Sign up with Google</span>
                            </button>
                            <button type="button" className="w-100 mb-3 btn btn-secondary">
                                <span className='nav-link-icon'>
                                    <FaFacebook />
                                </span>

                                <span>Sign up with Facebook</span>
                            </button>

                            <div className="position-relative">
                                <hr className="bg-body-secondary mt-4 mb-3"></hr>
                                <div className="divider-content-center">or use email</div>
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label" htmlFor="name">Name</label>
                                <input
                                    placeholder="Name"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={this.handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label" htmlFor="email">Email address</label>
                                <input
                                    placeholder="name@example.com"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className='g-3 mb-3 row'>
                                <div className="col-lg-6 col-sm-6">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input
                                        placeholder="Password"
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={this.handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="col-lg-6 col-sm-6">
                                    <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        placeholder="Confirm Password"
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={this.handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="justify-content-start mb-5 row">
                                <div className="col-auto">
                                    <div className="mb-0 form-check">
                                        <input
                                            name="termsAccepted"
                                            type="checkbox"
                                            id="termsAccepted"
                                            checked={termsAccepted}
                                            onChange={this.handleChange}
                                            className="form-check-input"
                                        />
                                        <label htmlFor="termsAccepted" className="fs-9 text-transform-none form-check-label">
                                            I accept the
                                            <a className="fw-semibold text-decoration-none" href=""> terms </a>
                                            and
                                            <a className="fw-semibold text-decoration-none" href=""> privacy policy</a>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button to="/management/singin" type="submit" className="w-100 mb-3 btn btn-lab">Sign Up</button>
                            <div className="text-center">
                                <Link className="fw-bold text-decoration-none" to="/management/singin">
                                    Sign in to an existing account
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default SignUp;

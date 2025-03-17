// src/components/SignIn.js
import React, { Component } from 'react';
import { MdOutlineHexagon } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6";
import axios from 'axios';
import { AuthContext } from "../context/AuthContext"; // Импорт контекста

class SignIn extends Component {
    state = {
        email: '',
        password: '',
        errorMessage: '',
    };

    static contextType = AuthContext; // Привязываем компонент к контексту

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = this.state;
        const { login } = this.context; // Получаем метод login из AuthContext

        //     try {
        //         const response = await axios.post('http://localhost:3000/api/users/login', {
        //             email,
        //             password,
        //         });


        //         // Сохранение токена в localStorage
        //         const token = response.data.token;
        //         localStorage.setItem('authToken', token);

        //         // Загрузка данных пользователя через контекст
        //         console.log("token:",token)
        //         loadUser();

        //         // Очистка состояния и редирект
        //         this.setState({ email: '', password: '', errorMessage: '' });
        //         alert('Вы успешно вошли в систему!');
        //         window.location.href = '/customer/profile'; // Измените на ваш маршрут
        //     } catch (error) {
        //         console.error(error); // Логируем ошибку
        //         this.setState({
        //             errorMessage: error.response?.data?.message || 'Ошибка входа. Проверьте ваши данные.',
        //         });
        //     }
        // };
        const result = await login(email, password);

        if (result.success) {
            this.setState({ email: '', password: '', errorMessage: '' });
            alert('Вы успешно вошли в систему!');
            window.location.href = '/customer/profile'; // Перенаправляем после успешного входа
        } else {
            this.setState({ errorMessage: result.message });
        }
    };

    render() {
        const { email, password, errorMessage } = this.state;

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
                                <h3 className="text-body-highlight">Sign In</h3>
                                <p className="text-body-tertiary">Get access to your account</p>
                            </div>
                            <button type="button" className="w-100 mb-3 btn btn-secondary">
                                <div className='social-media-icons'>
                                    <FaGoogle /> Sign in with Google
                                </div>
                            </button>
                            <button type="button" className="w-100 mb-3 btn btn-secondary">
                                <div className='social-media-icons'>
                                    <FaFacebook /> Sign in with Facebook
                                </div>
                            </button>
                            <div className="position-relative">
                                <hr className="bg-body-secondary mt-4 mb-3" />
                                <div className="divider-content-center">or use email</div>
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <div className="mb-3 text-start">
                                <label className="form-label" htmlFor="email">Email address</label>
                                <div className="form-icon-container">
                                    <input
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        id="email"
                                        className="form-icon-input form-control"
                                        value={email}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3 text-start">
                                <label className="form-label" htmlFor="password">Password</label>
                                <div className="form-icon-container">
                                    <input
                                        name="password"
                                        placeholder="Password"
                                        type="password"
                                        id="password"
                                        className="form-icon-input form-control"
                                        value={password}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="justify-content-between mb-5 row">
                                <div className="col-auto">
                                    <div className="mb-0 form-check">
                                        <input type="checkbox" id="remember-me" className="form-check-input" />
                                        <label htmlFor="remember-me" className="mb-0 form-check-label">Remember me</label>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <a className="fw-semibold text-decoration-none" href="#">Forgot Password?</a>
                                </div>
                            </div>
                            <button type="submit" className="w-100 mb-3 btn btn-lab">Sign In</button>
                            <div className="text-center">
                                <Link className="fw-bold text-decoration-none" to="/management/singup">
                                    Create an account
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;

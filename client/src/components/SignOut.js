// src/components/SignOut.js
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { MdOutlineHexagon } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import withNavigate from '../utils/withNavigate'; // Импорт HOC

class SignOut extends Component {
    static contextType = AuthContext; // Привязываем компонент к контексту

    componentDidMount() {
        const { logout } = this.context; // Получаем метод logout из контекста
        const { navigate } = this.props; // Получаем navigate из HOC

        logout(); // Выполняем выход из аккаунта

        setTimeout(() => {
            navigate('/management/signin'); // Перенаправление через 3 секунды
        }, 30000);
    }

    render() {
        return (
            <div className='container' data-theme="light">
                <div className='justify-content-center align-items-center min-vh-100 py-5 row'>
                    <div className='col-xl-5 col-xxl-3 col-lg-5 col-md-8 col-sm-10'>
                        <div className='text-center mb-5 mx-auto'>
                            <a className="d-flex justify-content-center text-decoration-none mb-4" href="/">
                                <div className="fw-bolder fs-5 d-inline-block d-flex align-items-center">
                                    <MdOutlineHexagon className="auth logo" />
                                </div>
                            </a>
                            <div className="mb-5">
                                <h4 className="text-body-highlight">Come back soon!</h4>
                                <p className="text-body-tertiary">
                                    Thanks for using Phoenix.<br className="d-lg-none" />
                                    You are now successfully signed out.
                                </p>
                            </div>
                            <div>
                                <Link to="/management/signin" className='w-100 mb-3 btn btn-lab'>Go to sign in page</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNavigate(SignOut); // Оборачиваем компонент в HOC

// src/components/SignOut.js
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { MdOutlineHexagon } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import withNavigate from '../utils/withNavigate'; // Импорт HOC

class SignOut extends Component {
    static contextType = AuthContext; // Привязываем компонент к контексту


    state = {
        countdown: 100 // Начинаем с 10 секунд, можно изменить
    };

    componentDidMount() {
        this.performLogout();

        // Запуск интервала для обратного отсчета
        this.interval = setInterval(() => {
            this.setState(prevState => {
                if (prevState.countdown <= 1) {
                    clearInterval(this.interval); // Остановить отсчёт
                    this.props.navigate('/');    // Редирект
                }
                return { countdown: prevState.countdown - 1 };
            });
        }, 1000);
    }

    componentWillUnmount() {
        // Очищаем интервал при размонтировании компонента
        clearInterval(this.interval);
    }

    performLogout = async () => {
        const { logout } = this.context;
        await logout();
        // Весь переход теперь обрабатывается в setInterval
    };

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
                            <div className=''>
                                <Link to="/management/signin" className='w-100 mb-3 btn btn-lab'>Go to sign in page</Link>
                            </div>
                            <p className="text-body-secondary">
                                You will be redirected in <strong>{this.state.countdown}</strong> second{this.state.countdown !== 1 ? 's' : ''}...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNavigate(SignOut); // Оборачиваем компонент в HOC

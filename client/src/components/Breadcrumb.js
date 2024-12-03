import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();

    // Разбиваем текущий путь на части
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb lab-breadcrumb">
                {/* Главная страница */}
                <li className="breadcrumb-item" >
                    <Link to="/">Home</Link>
                </li>

                {/* Динамические элементы пути */}
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return isLast ? (
                        <li className="breadcrumb-item active" key={to} aria-current="page">
                            {value.replace(/-/g, ' ')}
                        </li>
                    ) : (
                        <li className="breadcrumb-item" key={to}>
                            <Link to={to}>{value.replace(/-/g, ' ')}</Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;

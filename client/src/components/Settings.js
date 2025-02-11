import React from 'react';
import { IoIosSunny } from "react-icons/io";
import { IoIosMoon } from "react-icons/io";
import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
class Settings extends React.Component {
    state = {theme: "light",}

    toggleTheme = (theme) => {
        this.setState({ theme });
        document.documentElement.setAttribute("data-theme", theme);// Установить атрибут темы на корневом элементе
        localStorage.setItem("theme", theme); 
    };

    componentDidMount() {
        const savedTheme = localStorage.getItem("theme") || "light";
        this.setState({ theme: savedTheme });
        document.documentElement.setAttribute("data-theme", savedTheme);
    }

    render() {
        const { theme } = this.state;
        return (
            <div className="offcanvas settings-offcanvas offcanvas-end" id="offcanvasSettings" tabIndex={"-1"} aria-labelledby="offcanvasSettingsLabel">
                <div className="offcanvas-header"></div>
                <div className="offcanvas-body">
                    <a className="btn-close" href="#" data-bs-dismiss="offcanvas" aria-label="Close"></a>
                    <div className="text-center">
                        <img src="/designer-life.svg" alt="" />
                    </div>
                    <h2 className="text-center mb-2">
                        Make Dashkit Your Own
                    </h2>
                    <p className="text-center mb-4">
                        Set preferences that will be cookied for your live preview demonstration.
                    </p>
                    <hr className="mb-4"></hr>
                    <h4 className="mb-1">
                        Color Scheme
                    </h4>
                    <p className="small text-body-secondary mb-3">
                        Overall light or dark presentation.
                    </p>
                    <div className="btn-group-toggle row gx-2 mb-4">
                        <div className="col">
                            <input className="btn-check" checked={theme === "light"}
                                onChange={() => this.toggleTheme("light")} name="colorScheme" id="colorSchemeLight" type="radio" value="light"></input>
                            <label className="btn w-100 btn-dark btn-outline-light" htmlFor="colorSchemeLight">
                                <FaSun />
                                Light Mode
                            </label>
                        </div>
                        <div className="col">
                            <input className="btn-check" checked={theme === "dark"}
                                onChange={() => this.toggleTheme("dark")} name="colorScheme" id="colorSchemeDark" type="radio" value="dark"></input>
                            <label className="btn w-100 btn-dark btn-outline-light" htmlFor="colorSchemeDark">
                                <FaMoon />
                                Dark Mode
                            </label>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default Settings;

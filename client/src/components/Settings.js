import React, { useContext } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { usePanel } from "../context/PanelContext";
import { ThemeContext } from "../context/ThemeContext";

const Settings = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { activePanel, closePanel } = usePanel();
    const isOpen = activePanel === "settings";

    return (
        <div
            className={`offcanvas settings-offcanvas offcanvas-end${isOpen ? " show" : ""}`}
            id="offcanvasSettings"
            tabIndex={-1}
            aria-hidden={!isOpen}
            aria-labelledby="offcanvasSettingsLabel"
        >
            <div className="offcanvas-header" />
            <div className="offcanvas-body position-relative">
                <button type="button" className="btn-close position-absolute top-0 end-0 m-3" aria-label="Close" onClick={closePanel} />
                <div className="text-center pt-2">
                    <img src="/designer-life.svg" alt="" />
                </div>
                <h2 className="text-center mb-2" id="offcanvasSettingsLabel">
                    Appearance
                </h2>
                <p className="text-center mb-4 text-body-secondary small">Theme is stored in the browser for this app.</p>
                <hr className="mb-4" />
                <h4 className="mb-1">Color scheme</h4>
                <p className="small text-body-secondary mb-3">Overall light or dark presentation.</p>
                <div className="btn-group-toggle row gx-2 mb-4">
                    <div className="col">
                        <input
                            className="btn-check"
                            checked={theme === "light"}
                            onChange={() => toggleTheme("light")}
                            name="colorScheme"
                            id="colorSchemeLight"
                            type="radio"
                            value="light"
                        />
                        <label className="btn w-100 btn-dark btn-outline-light" htmlFor="colorSchemeLight">
                            <FaSun className="me-1" />
                            Light
                        </label>
                    </div>
                    <div className="col">
                        <input
                            className="btn-check"
                            checked={theme === "dark"}
                            onChange={() => toggleTheme("dark")}
                            name="colorScheme"
                            id="colorSchemeDark"
                            type="radio"
                            value="dark"
                        />
                        <label className="btn w-100 btn-dark btn-outline-light" htmlFor="colorSchemeDark">
                            <FaMoon className="me-1" />
                            Dark
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;


import React from "react";
class Account extends React.Component {
    state = {}
    render() {
        return (
            <div className="offcanvas offcanvas-end  text-bg-dark" id="offcanvasAccount" tabIndex="-1" aria-labelledby="offcanvasSettingsLabel">
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

                </div>


            </div>

        );
    }
}

export default Account;
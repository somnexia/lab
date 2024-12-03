
import React from "react";
class CardOffcanvas extends React.Component {
    state = {}
    render() {
        return (
            <div className="offcanvas offcanvas-end  text-bg-dark" id="offcanvasAccount" tabIndex="-1">
                <div className="offcanvas-header"></div>
                <div className="offcanvas-body">
                    <a className="btn-close" href="#" data-bs-dismiss="offcanvas" aria-label="Close"></a>
                    

                </div>


            </div>

        );
    }
}

export default CardOffcanvas;
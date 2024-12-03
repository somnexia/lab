import React from "react";

class Footer extends React.Component {
    render() {
        return (
            <footer className="footer px-md-5">
                <div className="g-1 justify-content-between align-items-center h-100 row">
                    <div className="text-center col-12 col-sm-auto ">
                        <p className="m-0 mt-sm-0">&copy; All user rights reserved</p>
                    </div>

                    <div className="text-center col-12 col-sm-auto">
                        <p className="mb-0" style={{color:"#727cf5"}}>v1.5.0</p>
                    </div>

                </div>
            </footer >
        )
    }


}
export default Footer
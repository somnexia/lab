import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";

import axios from 'axios';


class ProfileDropdown extends Component {
    state = {}
    render() {
        return (
            <div className="dropdown-menu dropdown-menu-end" data-bs-popper="static">
                <div class="position-relative border-0 card">
                    <div className="p-0 card-body">
                        <div className="d-flex flex-column align-items-center justify-content-center gap-2 pt-4 pb-3">
                            <div className="avatar avatar-xl">
                                <div class="mb-3 mx-3">
                                    <input placeholder="Update your status" type="text" class="form-control form-control-sm"></input>
                                </div>
                                <div className="dropdown-content">
                                    <ul className="flex-column navbar-nav">
                                        <li className="nav-item">
                                            <a className='px-3 nav-link' href="/customer/profile">
                                                <FaRegUserCircle />
                                                <span class="text-body-highlight">Profile</span>
                                            </a>
                                        </li>
                                    </ul>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ProfileDropdown;
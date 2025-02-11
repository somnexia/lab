import React, { useContext, Component } from 'react';
import axios from 'axios';
import { FaFacebook } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';




class Profile extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loading: true,
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.fetchUserProfile();
    }

    fetchUserProfile = async () => {
        try {
            const userId = 1; // Замените на реальный id пользователя
            const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
            this.setState({ user: response.data, isLoading: false });
        } catch (error) {
            console.error('Ошибка при загрузке профиля:', error);
            this.setState({ error: 'Ошибка при загрузке профиля', isLoading: false });
        }
    };

    handleUpdateUser = async (updatedData) => {
        try {
            const userId = this.state.user.id;
            const response = await axios.put(`http://localhost:3000/api/users/${userId}`, updatedData);
            this.setState({ user: response.data });
            alert('Профиль обновлен успешно!');
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            alert('Ошибка при обновлении профиля');
        }
    };

    render() {
        const { user, loading } = this.context;

        if (loading) {
            return <div>Загрузка...</div>;
        }

        if (!user) {
            return( 

            <div>
                 <h2>Profile</h2>
                 <hr />
                <p>You are not authorized. Please authorize to see your profile.</p>
                <p>
                    Click{" "}
                    <a className="text-decoration-none" href="/management/signin">
                        here
                    </a>{" "}
                    to sign in...
                </p>
            </div>
            )
        }

        return (
            <div>
                <h2>Profile</h2>
                <hr />
                <div className='container'>

                    {user ? (
                        <div></div>
                    ) : (
                        <div>
                            <p>You are not authorized. Please authorize to see your profile.</p>
                            <p>
                                Click{" "}
                                <a className="text-decoration-none" href="/management/signin">
                                    here
                                </a>{" "}
                                to sign in...
                            </p>
                        </div>
                    )}

                    <div className='g-3 mb-5 row'>
                        <div className='col-lg-8 col-12'>
                            <div className="h-100 card">
                                <div className="card-body">
                                    <div className="border-bottom border-dashed pb-4">
                                        <div className="align-items-center g-3 g-sm-5 text-center text-sm-start row">
                                            <div className="col-sm-auto col-12">
                                                <div className="d-inline-flex">
                                                    <input className="d-none" id="avatarFile" type="file" accept="image/*"></input>
                                                    <label className="cursor-pointer hover-actions-trigger" htmlFor="avatarFile">
                                                        <div className="avatar avatar-5xl">

                                                        </div>

                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex-1 col-sm-auto col-12">
                                                <h3>{user.name}</h3>
                                                <p className="text-body-secondary">Email: {user.email}</p>
                                                <p className="text-body-secondary">Дата присоединения: {new Date(user.createdAt).toLocaleDateString()}</p>
                                                <div className='social-media-icons'>

                                                    <FaLinkedin />
                                                    <FaFacebook />

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-between-center pt-4"><div>
                                        <h6 className="mb-2 text-body-secondary">Total Spent</h6>
                                        <h4 className="fs-7 text-body-highlight mb-0">${user.totalSpent || 0}</h4>
                                    </div>
                                        <div className="text-end">
                                            <h6 className="mb-2 text-body-secondary">Last Order</h6>
                                            <h4 className="fs-7 text-body-highlight mb-0">{user.lastOrder || 'Недоступно'}</h4>
                                        </div>
                                        <div className="text-end">
                                            <h6 className="mb-2 text-body-secondary">Total Orders</h6>
                                            <h4 className="fs-7 text-body-highlight mb-0">97</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='col-lg-4 col-12'>
                            <div className="h-100 card">
                                <div className="card-body">
                                    <div className="border-bottom border-dashed mb-4">
                                        <h4 className="mb-3 lh-sm lh-xl-1">Default Address
                                            <button type="button" className="p-0 ms-3 btn btn-link">
                                            </button>
                                        </h4>
                                    </div>
                                    <div className="pb-7 pb-lg-4 pb-xl-7 mb-4 border-bottom border-dashed">
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <h5 className="text-body-highlight">Address</h5>
                                            <p className="text-body-secondary">Vancouver, British Columbia
                                                <br></br>
                                                Canada</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between gap-2 mb-3">
                                            <h5 className="text-body-highlight mb-0">Email</h5>
                                            <a className="lh-1" href="mailto:shatinon@jeemail.com">shatinon@jeemail.com</a>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                            <h5 className="text-body-highlight mb-0">Phone</h5>
                                            <a href="tel:+1234567890">+1234567890</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='mb-3 pb-1 gap-3 nav-underline flex-nowrap scrollbar nav' id="nav-tab" role="tablist">
                        <div className='nav-item'>
                            <a className="nav-link active" aria-current="page" href="#">Orders</a>
                        </div>
                        <div className='nav-item'>
                            <a className="nav-link" href="#">Returns</a>
                        </div>
                        <div className='nav-item'>
                            <a className="nav-link" href="#">Reviews</a>
                        </div>
                        <div className='nav-item'>
                            <a className="nav-link" href="#">Wishlist</a>
                        </div>
                        <div className='nav-item'>
                            <a className="nav-link" href="#">Personal Info</a>
                        </div>

                    </div>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabIndex="0">
                            <div className='border-top border-bottom'>
                                <div className='scrollbar ps-1'>
                                    <div className="table-responsive" data-bs-theme="dark" >
                                        <table className="table cart-table table-hover bg-transparent " >
                                            <thead>
                                                <tr>
                                                    <th>Order №</th>
                                                    <th>Status</th>
                                                    <th>Deta</th>
                                                    <th>Location</th>
                                                    <th>Payment Account</th>
                                                    <th>Total</th>


                                                </tr>
                                            </thead>
                                            <tbody>



                                                <tr>
                                                    <td><strong></strong></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>


                                            </tbody>
                                        </table>
                                    </div>


                                </div>

                            </div>
                        </div>
                        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabIndex="0">...</div>
                        <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" tabIndex="0">...</div>
                        <div className="tab-pane fade" id="nav-disabled" role="tabpanel" aria-labelledby="nav-disabled-tab" tabIndex="0">...</div>
                    </div>



                </div>
            </div>

        );
    }
}

export default Profile;
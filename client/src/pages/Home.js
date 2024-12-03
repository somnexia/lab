import React, { Component } from 'react'
// import CreateProject from '../components/CreateProject'

export class Home extends Component {
	render() {
		return (
			<><aside className='vertical-nav col-2'>

				{/* <div className="d-flex flex-column navbar-vertical navbar navbar-expand-lg p-3 bg-dark">
					<a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">

						<span className="fs-4 py-2">Search</span>
					</a>
					<hr></hr>
					<h6 className="navbar-heading text-secondary">Pages</h6>

					<div className="vertical-nav-scroll" data-bs-spy="scroll" data-bs-target="#navId">


						<ul className="nav nav-pills">
							<li className="mb-1">
								<button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
									Home
								</button>
								<div className="collapse" id="home-collapse">
									<ul className=" nav-tabs list-unstyled fw-normal pb-1 small">
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Overview</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Updates</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Reports</a></li>
									</ul>
								</div>
							</li>
							<li className="mb-1">
								<button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
									Dashboard
								</button>
								<div className="collapse" id="dashboard-collapse">
									<ul className="nav-tabs list-unstyled fw-normal pb-1 small">
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Overview</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Weekly</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Monthly</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Annually</a></li>
									</ul>
								</div>
							</li>
							<li className="mb-1">
								<button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
									Orders
								</button>
								<div className="collapse" id="orders-collapse">
									<ul className="nav-tabs list-unstyled fw-normal pb-1 small">
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Processed</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Shipped</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Returned</a></li>
									</ul>
								</div>
							</li>

							<li className="mb-1">
								<button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#products-collapse" aria-expanded="false">
									Products
								</button>
								<div className="collapse" id="products-collapse">
									<ul className="nav-tabs list-unstyled fw-normal pb-1 small">
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New...</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
									</ul>
								</div>
							</li>
							<li className="mb-1">
								<button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#customers-collapse" aria-expanded="false">
									Customers
								</button>
								<div className="collapse" id="customers-collapse">
									<ul className="nav-tabs list-unstyled fw-normal pb-1 small">
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New...</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
									</ul>
								</div>
							</li>
							<li className="mb-1">
								<button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
									Account
								</button>
								<div className="collapse" id="account-collapse">
									<ul className="nav-tabs list-unstyled fw-normal pb-1 small">
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New...</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
									</ul>
								</div>
							</li>
						</ul>
						<hr></hr>
						<h6 className="navbar-heading text-secondary">Documentation</h6>

						<ul className="nav nav-pills">

							<li className="mb-1">
								<button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#basics-collapse" aria-expanded="false">
									Basics
								</button>
								<div className="collapse" id="basics-collapse">
									<ul className="nav-tabs list-unstyled fw-normal pb-1 small">
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New...</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
									</ul>
								</div>
							</li>
							<li className="mb-1">
								<button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#components-collapse" aria-expanded="false">
									Components
								</button>
								<div className="collapse" id="components-collapse">
									<ul className="nav-tabs list-unstyled fw-normal pb-1 small">
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New...</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
									</ul>
								</div>
							</li>
							<li className="mb-1">
								<button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#changelog-collapse" aria-expanded="false">
									Changelog
								</button>
								<div className="collapse" id="changelog-collapse">
									<ul className="nav-tabs list-unstyled fw-normal pb-1 small">
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New...</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
										<li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
									</ul>
								</div>
							</li>

							<div className="dropdown">
								<a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">


								</a>
								<ul className="dropdown-menu dropdown-menu-dark text-small shadow">
									<li><a className="dropdown-item" href="#">New project...</a></li>
									<li><a className="dropdown-item" href="#">Settings</a></li>
									<li><a className="dropdown-item" href="#">Profile</a></li>
									<li><a className="dropdown-item" href="#">Sign out</a></li>
								</ul>
							</div>
						</ul>
					</div>
				</div> */}




			</aside>

				<main>
					


					{/* <CreateProject></CreateProject> */}

				</main></>



		)
	}
}

export default Home

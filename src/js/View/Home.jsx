import React from 'react';

export default function Home() {
    return (
        <div className="container">
            <div className="row mb-4 mt-1">
                <div className="col-auto"><h1>Home</h1></div>
            </div>

            <div className="row g-4 mb-4">
                <h2 className="fw-normal mb-0">Feature List</h2>
                <ul className="list-unstyled">
                    <li>Overview Pages with Filters for Projects, Milestones and Bugs.</li>
                    <li>Comment Function for Bug Entitys</li>
                    <li>Bug Statistics Page</li>
                    <li>Kanban Like Board with Filters</li>
                    <li>Searchbar in Navigation</li>
                    <li>Authentification:</li>
                    <ul>
                        <li>Login and Registration form</li>
                        <li>Verification e-mail and Resend verification button</li>
                        <li>Forgot my password form</li>
                        <li>Edit User information form</li>
                    </ul>
                    <li>Responsive Design for Mobile, Tablet and Desktop</li>
                </ul>
            </div>

            <div className="row g-4 mb-4">
                <h2 className="fw-normal mb-0">Preview Screenshots</h2>
                <div className="col-12 col-lg-10 p-1 bg-opacity-75 bg-dark">
                    <div id="carouselCaptions" className="carousel carousel-fade carousel-dark slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            <button
                                type="button"
                                data-bs-target="#carouselCaptions"
                                data-bs-slide-to="0"
                                className="active"
                                aria-current="true"
                                aria-label="Slide 1"
                            />
                            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="1" aria-label="Slide 2" />
                            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="2" aria-label="Slide 3" />
                            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="3" aria-label="Slide 4" />
                            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="4" aria-label="Slide 5" />
                            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="5" aria-label="Slide 6" />
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="/screenshot_01.webp" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="/screenshot_02.webp" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="/screenshot_03.webp" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="/screenshot_04.webp" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="/screenshot_05.webp" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="/screenshot_06.webp" className="d-block w-100" alt="..." />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselCaptions" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true" />
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselCaptions" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true" />
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

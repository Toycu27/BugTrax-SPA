import React from 'react';

export default function Home() {
    return (
        <div className="container">
            <div className="row mb-3 mt-1">
                <div className="col-auto"><h1>BugTrax</h1></div>
            </div>

            <div className="row g-4 mb-4">
                <h2 className="fw-normal mb-0">
                    Bug Tracking Software
                    <br />
                    Spezialized for the Web
                </h2>
                <ul className="ms-5">
                    <li>Login and Registration</li>
                    <li>Full Responsive Design</li>
                    <li>Auto Light and Dark Mode</li>
                    <li>Bug Form is Web specific</li>
                    <li>Entity Pages with Filters</li>
                    <li>Comment Function</li>
                    <li>Project Statistics</li>
                    <li>Kanban Board with Filters</li>
                    <li>Navigation Searchbar</li>
                </ul>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12 col-lg-10 p-1 bg-secondary">
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

import React from 'react';

export default function Home() {
    return (
        <div className="container">
            <div className="row mb-3 mt-1">
                <div className="col-auto"><h1>BugTrax</h1></div>
            </div>

            <div className="row g-4 mb-4">
                <p className="fw-normal mb-3 fs-4">
                    Bug Tracking Software Designed for the Web
                    <br />
                    Make it easy for Developers to locate information to fix Bugs
                </p>
                <div className="row">
                    <div className="col-auto">
                        <ul className="ms-5">
                            <li>Bug Form is web specific</li>
                            <li>Entity Pages with filters</li>
                            <li>Kanban Board with filters</li>
                            <li>Navigation searchbar</li>
                            <li>Project statistics</li>
                            <li>Comment function</li>
                        </ul>
                    </div>
                    <div className="col-auto">
                        <ul className="ms-5">
                            <li>Login and registration</li>
                            <li>Full responsive design</li>
                            <li>Auto light and dark mode</li>
                        </ul>
                    </div>
                </div>
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
                        <button className="carousel-control-prev bg-secondary" type="button" data-bs-target="#carouselCaptions" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true" />
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next bg-secondary" type="button" data-bs-target="#carouselCaptions" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true" />
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

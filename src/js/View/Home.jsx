export default function Home() {

  return (<div className="container">
    <div className="row mb-4 mt-1">
      <div className="col-auto"><h2>Home</h2></div>
    </div>

    <div className="row g-4 mb-4">
      <h4 className="fw-normal mb-0">Feature List</h4>
      <ul class="list-unstyled">
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
      <h4 className="fw-normal mb-0">Preview Screenshots</h4>
      <div className="col-12 col-lg-10 p-1 bg-opacity-75 bg-dark">
        <div id="carouselCaptions" className="carousel carousel-fade carousel-dark slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
            <button type="button" data-bs-target="#carouselCaptions" data-bs-slide-to="5" aria-label="Slide 6"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/screenshot_01.png" className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src="/screenshot_02.png" className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src="/screenshot_03.png" className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src="/screenshot_04.png" className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src="/screenshot_05.png" className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src="/screenshot_06.png" className="d-block w-100" alt="..." />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselCaptions" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselCaptions" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  </div>)
}
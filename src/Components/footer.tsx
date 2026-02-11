import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faPhone} from "@fortawesome/free-solid-svg-icons";
import {Facebook, Instagram, Twitter} from "lucide-react";

const Footer = () => {
  return (
    <footer className="pt-4 border-top border-secondary bg-dark">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-3">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <img style={{width: '10vw'}} src='/images/Logo.png'></img>
                            </div>
                            <p className="text-light-emphasis" style={{textAlign: "justify"}}>
                                Recipenest is a comprehensive recipe platform where users can search, save, and share
                                their favorite recipes, and explore a variety of dishes from top chefs. It's your
                                one-stop destination for culinary inspiration and meal planning.
                                Discover the joy of cooking with our community of food lovers.
                            </p>
                        </div>
                        <div className="col-lg-3">
                            <h5 className="mb-3">Contact Us</h5>
                            <ul className="list-unstyled text-light-emphasis">
                                <li>
                                    <FontAwesomeIcon icon={faEnvelope} className="me-2" /> shrawon@gmail.com
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faPhone} className="me-2" /> +(977) 9393942032
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h5 className="mb-3">Follow Us</h5>
                            <div className="d-flex gap-3">
                                <Facebook className="text-light-emphasis"/>
                                <Instagram className="text-light-emphasis"/>
                                <Twitter className="text-light-emphasis"/>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <h5 className="mb-3">Navigation</h5>
                            <ul className="list-unstyled">
                                <li><a href="#" className="text-light-emphasis text-decoration-none">Home</a></li>
                                <li><a href="#" className="text-light-emphasis text-decoration-none">Recipes</a></li>
                                <li><a href="#" className="text-light-emphasis text-decoration-none">About</a></li>
                                <li><a href="#" className="text-light-emphasis text-decoration-none">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-light-emphasis pt-4 mt-4 border-top border-secondary">
                        <p>Copyright © 2024 RecipeNest | All rights reserved</p>
                    </div>
                </div>
            </footer>
  )
}

export default Footer

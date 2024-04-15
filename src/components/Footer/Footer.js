import React from "react";
import "./Footer.css"


function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="footer-container">
            &copy; {currentYear} <a href="https://www.epic.gatech.edu/" target="_blank" rel="noopener noreferrer">EPIC Lab</a>
        </div>
    )
}

export default Footer;
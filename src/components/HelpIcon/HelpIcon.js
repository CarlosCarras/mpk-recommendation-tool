import React, {useState, useEffect} from "react";

import './HelpIcon.css'


const HELP_ICON = require("../../assets/help_icon.png");


function HelpIcon({ tooltip, width = 120 }) {
    return (
        <div className="help-icon-container">
            <img alt="help" src={HELP_ICON} className="help-icon" />
            {tooltip && (
                <span className="help-tooltip" style={{ width: `${width}px` }}>
                    {tooltip}
                </span>
            )}
        </div>
    );
}

export default HelpIcon;
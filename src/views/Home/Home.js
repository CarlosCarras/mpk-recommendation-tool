import React, {useState} from "react";

import PatientForm from '../../components/UserForms/PatientForm';
import ScoresForm from '../../components/UserForms/ScoresForm';
import PrescriptionBarPlot from './../../components/PrescriptionBarPlot/PrescriptionBarPlot';
import ScoresBarPlot from "../../components/ScoresBarPlot/ScoresBarPlot";
import './Home.css'

import equation, { normalizeData } from "./Equation";


function Home() {
    const defaults = {
        age: 45,
        bmi: 35,
        ampnopro: 40,
        likelihoodStairs: 1,
        likelihoodRamps: 3
    }

    const defaultScores = normalizeData(defaults);
    const defaultResults = equation(defaultScores);
    const [userScores, setUserScores] = useState(defaultScores);
    const [userResults, setUserResults] = useState(defaultResults);
    const [visualizationSelected, setVisualizationSelected] = useState("knee");

    const onUpdateScoresForm = (scores) => {
        const results = equation(scores);

        setUserScores(scores);
        setUserResults(results);
    }

    const onUpdatePatientProfile = (userData) => {
        const scores = normalizeData(userData);
    
        onUpdateScoresForm(scores);
    }

    const handleVisualizationChange = (e) => {
        setVisualizationSelected(e.target.value)
    }

    return (
        <div className="home-container">
            <h1>Microprocessor Knee Recommendation Tool</h1>
            <br/>
            <div className="home-row">
                <div className="home-form">
                    <h3>
                        Step 1
                        <span> Fill out the user profile. </span>
                    </h3>
                    <PatientForm default={defaults} onUpdate={onUpdatePatientProfile}/>
                </div>
                <div className="home-form">
                    <h3>
                        Step 2
                        <span> Adjust functional needs as necessary. </span>
                    </h3>
                    <ScoresForm default={userScores} onUpdate={onUpdateScoresForm}/>
                </div>
                <div className="home-form">
                    <h3>
                        Step 3
                        <span> View your personalized results. </span>
                    </h3>
                    <div className="button-container">
                        <select name="visaulization" id="visaulization" value={visualizationSelected} onChange={handleVisualizationChange}>
                            <option value="knee">By Knee</option>
                            <option value="outcome">By Outcome</option>
                        </select>
                    </div>
                    {
                        (visualizationSelected === "knee") ?
                            <PrescriptionBarPlot data={userResults}/>
                            :
                            <ScoresBarPlot data={userScores}/>
                    }
                </div>
            </div>
            <div className="home-row">
                <p className="glass"> 
                    This is a transparent, data-driven clinical decision equation that utilizes experimentally derived knee scores for agility, community ambulation, stability, energy expenditure, and gait 
                    quality along with user-specific features to compose an informed knee prescription.
                    <br/>
                    <br/>
                    <b>Disclaimer: </b> This experimental software was developed by researchers at EPIC Lab of the Georgia Institude of Technology. This software has not been approved for clinical use. 
                    Please use at your own discretion. Consult with a professional Orthotist and Prosthetist first.
                </p>
            </div>
            
            {/* background decorations */}
            <div className="decorations-wrapper">
                <div id="decor1" className="decoration donut" />
                <div id="decor2" className="decoration" />
                <div id="decor3" className="decoration donut" />
                <div id="decor4" className="decoration" />
                <div id="decor5" className="decoration" />
            </div>
        </div>
    )
}

export default Home;
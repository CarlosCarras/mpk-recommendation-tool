import React, {useState, useEffect} from "react";
import './FormStyles.css'

import Slider from '../Slider/Slider';


function ScoresForm(props) {
    const default_agility = props.default["Agility"];
    const default_stairs = props.default["Stairs"];
    const default_ramps = props.default["Ramps"];
    const default_stability = props.default["Stability"];
    const default_energy = props.default["Energy"];
    const default_gaitquality = props.default["Gait Quality"];

    const [agilityScore, setAgilityScore] = useState(default_agility);
    const [stairsScore, setStairsScore] = useState(default_stairs);
    const [rampsScore, setRampsScore] = useState(default_ramps);
    const [stabilityScore, setStabilityScore] = useState(default_stability);
    const [energyScore, setEnergyScore] = useState(default_energy);
    const [gaitqualityScore, setGaitQualityScore] = useState(default_gaitquality);

    const handleAgilityChange = (value) => setAgilityScore(value); 
    const handleStairsChange = (value) => setStairsScore(value);
    const handleRampsChange = (value) => setRampsScore(value);
    const handleStabilityChange = (value) => setStabilityScore(value);
    const handleEnergyChange = (value) => setEnergyScore(value);
    const handleGaitQualityChange = (value) => setGaitQualityScore(value);

    const updateData = () => {
        if (props.onUpdate === null) {
            return;
        }
        
        props.onUpdate({
            'Agility': agilityScore,
            'Stairs': stairsScore,
            'Ramps': rampsScore,
            'Stability': stabilityScore,
            'Energy': energyScore,
            'Gait Quality': gaitqualityScore,
        })
    }

    useEffect(() => updateData(), [agilityScore, stairsScore, rampsScore, stabilityScore, energyScore, gaitqualityScore])
    useEffect(() => {
        if (props.default["Agility"] === null) {
            return;
        }

        setAgilityScore(props.default["Agility"]);
        setStairsScore(props.default["Stairs"]);
        setRampsScore(props.default["Ramps"]);
        setStabilityScore(props.default["Stability"]);
        setEnergyScore(props.default["Energy"]);
        setGaitQualityScore(props.default["Gait Quality"]);

    }, [props.default])
    
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="form-container glass">
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Stability</label>
                    <Slider min={0} max={1} default={stabilityScore} step={0.01} precision={2} onChange={handleStabilityChange} snap={false}/>
                    <label>Energy</label>
                    <Slider min={0} max={1} default={energyScore} step={0.01} precision={2} onChange={handleEnergyChange} snap={false}/>
                    <label>Agility</label>
                    <Slider min={0} max={1} default={agilityScore} step={0.01} precision={2} onChange={handleAgilityChange} snap={false}/>
                    <label>Stairs</label>
                    <Slider min={0} max={1} default={stairsScore} step={0.01} precision={2} onChange={handleStairsChange} snap={false}/>
                    <label>Ramps</label>
                    <Slider min={0} max={1} default={rampsScore} step={0.01} precision={2} onChange={handleRampsChange} snap={false}/>
                    <label>Gait Quality</label>
                    <Slider min={0} max={1} default={gaitqualityScore} step={0.01} precision={2} onChange={handleGaitQualityChange} snap={false}/>
                </div>
            </form>
        </div>
    )
}

export default ScoresForm;
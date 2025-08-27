import React, {useState, useEffect} from "react";
import './FormStyles.css'

import Slider from '../Slider/Slider';
import HelpIcon from "../HelpIcon/HelpIcon";


function PatientForm(props) {
    const default_age = props.default.age;
    const default_bmi = props.default.bmi;
    const default_ampnopro = props.default.ampnopro;
    const default_likelihoodStairs = props.default.likelihoodStairs;
    const default_likelihoodRamps = props.default.likelihoodRamps;

    const [age, setAge] = useState(default_age);
    const [bmi, setBmi] = useState(default_bmi);
    const [ampnopro, setAmpnopro] = useState(default_ampnopro);
    const [likelihoodStairs, setLikelihoodStairs] = useState(default_likelihoodStairs);
    const [likelihoodRamps, setLikelihoodRamps] = useState(default_likelihoodRamps);

    const handleAgeChange = (value) => setAge(value); 
    const handleBmiChange = (value) => setBmi(value);
    const handleAmpnoproChange = (value) => setAmpnopro(value);
    const handleLikelihoodStairsChange = (value) => setLikelihoodStairs(value);
    const handleLikelihoodRampsChange = (value) => setLikelihoodRamps(value);

    const updateData = () => {
        if (props.onUpdate === null) {
            return;
        }

        props.onUpdate({
            'age': age.toPrecision(2),
            'bmi': bmi.toPrecision(3),
            'ampnopro': ampnopro.toPrecision(2),
            'likelihoodStairs': likelihoodStairs.toPrecision(1),
            'likelihoodRamps': likelihoodRamps.toPrecision(1),
        })
    }

    useEffect(() => updateData(), [age, bmi, ampnopro, likelihoodRamps, likelihoodStairs])
    
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const likelihoodHelp = () => <HelpIcon tooltip={"1 = extemely unlikely\n2 = unlikely\n3 = neutral\n4 = likely\n5 = extremely likely"} width={140}/>

    return (
        <div className="form-container glass">
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Age</label>
                    <Slider min={16} max={60} default={default_age} step={1} precision={2} onChange={handleAgeChange} snap={true}/>
                    <label>BMI</label>
                    <Slider min={15} max={35} default={default_bmi} step={0.1} precision={3} onChange={handleBmiChange} snap={true}/>
                    <label>AmpNoPro</label>
                    <Slider min={23} max={45} default={default_ampnopro} step={1} precision={2} onChange={handleAmpnoproChange} snap={true}/>
                    <label>Daily Likelihood of Climbing Up/Down Stairs {likelihoodHelp()} </label>
                    <Slider min={1} max={5} default={default_likelihoodStairs} step={1} precision={1} onChange={handleLikelihoodStairsChange} snap={true}/>
                    <label>Daily Likelihood of Walking Up/Down Ramps {likelihoodHelp()} </label>
                    <Slider min={1} max={5} default={default_likelihoodRamps} step={1} precision={1} onChange={handleLikelihoodRampsChange} snap={true}/>
                </div>
            </form>
        </div>
    )
}

export default PatientForm;
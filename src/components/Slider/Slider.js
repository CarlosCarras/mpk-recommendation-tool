import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Slider.css";


function Slider(props) {
    const minValue = props.min || 0;
    const maxValue = props.max || 100;
    const defaultValue = props.default || minValue;

    const [isDragging, setIsDragging] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [inputValue, setInputValue] = useState(defaultValue);
    const sliderRef = useRef(null);
    const inputRef = useRef(null);

    const stepSize = props.step || 1;
    let snapPositions = null;
    if (props.snap || false) {
        snapPositions = [];
        for (let value = minValue; value <= maxValue; value += stepSize) {
            snapPositions.push(value);
        }
        
        if (snapPositions.slice(-1) !== maxValue) {
            snapPositions.push(maxValue);
        }
    }

    const limit = (value, min, max) => {
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        return value;
    }

    /* conversion functions */
    const position2value = useCallback((position) => {
        const normalized = position / sliderRef.current.getBoundingClientRect().width;
        const value = normalized * (maxValue - minValue) + minValue;
        return value;
    }, [minValue, maxValue]);

    const value2position = useCallback((value) => {
        const normalized = (value - minValue) / (maxValue - minValue);
        const position = normalized * sliderRef.current.getBoundingClientRect().width;
        return position;
    }, [minValue, maxValue]);

    /* position snapping callback */
    const snapToPosition = useCallback((position) => {
        if (snapPositions === null) {
            return position;
        }

        const value = position2value(position);
        const closest = snapPositions.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        );

        const newPosition = value2position(closest); 

        setSliderPosition(newPosition);
        setInputValue(closest.toPrecision(props.precision));
    }, [snapPositions, position2value, value2position, props.precision]);

    /* updates slider position when parent default value changes */
    useEffect(() => {
        const initialPosition = value2position(defaultValue);
        setSliderPosition(initialPosition);
        setInputValue(defaultValue.toPrecision(props.precision));
    }, [defaultValue, props.precision, value2position]);

    /* if the window is resized, update slider position */
    useEffect(() => {
        const handleResize = () => {
            const newPosition = value2position(inputValue);
            setSliderPosition(newPosition);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [inputValue, value2position]);

    /* allow for mouse click and drag to change position */
    useEffect(() => {
        const handlePositionChange = (clientX) => {
            const sliderRect = sliderRef.current.getBoundingClientRect();
            let newPosition = clientX - sliderRect.left;
            newPosition = limit(newPosition, 0, sliderRect.width);

            setSliderPosition(newPosition);
            const value = position2value(newPosition);
            setInputValue(value.toPrecision(props.precision));
            snapToPosition(newPosition);

            if (props.onChange) {
                props.onChange(parseFloat(value));
            }
        };

        const handleMouseMove = (event) => {
            if (isDragging) {
                handlePositionChange(event.clientX);
            }
        };

        const handleTouchMove = (event) => {
            if (isDragging) {
                event.preventDefault(); 
                handlePositionChange(event.touches[0].clientX);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleTouchEnd, { passive: false });

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isDragging, props, position2value, snapToPosition]);

    const handleMouseDown = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleTouchStart = (event) => {
        setIsDragging(true);
    };

    const handleInputBlur = (event) => {
        const value = limit(event.target.value, minValue, maxValue);
        const newPosition = value2position(value);

        event.target.value = value;
        setInputValue(value);
        setSliderPosition(newPosition);

        if (props.onChange) {
            props.onChange(parseFloat(value));
        }
    }

    const handleInputUpdate = (event) => {
        const value = event.target.value;
        const newPosition = value2position(limit(event.target.value, minValue, maxValue));
        setInputValue(value);
        setSliderPosition(newPosition);

        if (props.onChange) {
            props.onChange(parseFloat(value));
        }
    }

  return (
    <div className="slider-container">
        <div className="slider-wrapper" ref={sliderRef}>
            <div className="bar"/>
            <div className="slider"
                 onMouseDown={handleMouseDown}
                 onTouchStart={handleTouchStart}
                 style={{ left: `${sliderPosition}px` }}
            />
        </div>
        <input ref={inputRef}
               type="number" 
               value={inputValue}
               min={minValue} 
               max={maxValue}
               step={stepSize}
               onChange={handleInputUpdate}
               onBlur={handleInputBlur}
        />
    </div>
  );
}

export default Slider;

import React from 'react';
import PropTypes from 'prop-types';

const
	STEP_WIDTH = 45,
	STEP_DIAMETER = 9;

const
	BULLET_STYLE = {
		width: `${STEP_DIAMETER}px`,
		height: `${STEP_DIAMETER}px`,
		marginRight: `${STEP_WIDTH - STEP_DIAMETER}px`,
	},
	LINE_STYLE = {
		left: `${STEP_DIAMETER / 2.0}px`,
		top: `${STEP_DIAMETER / 2.0 - 1}px`,
		bottom: `${STEP_DIAMETER / 2.0 - 1}px`,
	};

const StepProgressBar = ({
	steps,
	progress,
}) => {
	const
		lineEmptyStyle = {
			...LINE_STYLE,
			width: `${(steps - 1) * STEP_WIDTH}px`,
		},
		lineFilledStyle = {
			...LINE_STYLE,
			width: `${progress * (steps - 1) * STEP_WIDTH}px`,
		};

	const items = [];
	const isFilled = (stepNumber) => stepNumber / (steps - 1) <= progress;

	for (let i = 0; i < steps; i++) {
		// Bind the progress lines position to the first bullet
		if (i === 0) {
			items.push(
				<li key={i}
						style={ {
							...BULLET_STYLE,
							position: "relative",
						} }
						className={isFilled(i) ? "filled" : "empty"}>
					<div className="line empty" style={lineEmptyStyle}/>
					<div className="line filled" style={lineFilledStyle}/>
				</li>
			);
		} else if (i === steps - 1) {
			items.push(
				<li key={i}
						style={{
							...BULLET_STYLE,
							marginRight: 0,
						}}
						className={isFilled(i) ? "filled" : "empty"}>
				</li>
			);
		} else {
			items.push(
				<li key={i}
						style={BULLET_STYLE}
						className={isFilled(i) ? "filled" : "empty"}>
				</li>
			);
		}
	}

	return <ul className="step-progress-bar">
		{items}
	</ul>;
};

StepProgressBar.propTypes = {
	steps: PropTypes.number.isRequired,
	progress: PropTypes.number.isRequired,
};

export default StepProgressBar;

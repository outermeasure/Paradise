import React from 'react';
import PaperRipple from 'react-paper-ripple';
import * as Colors from '../../../../js/colors';
import * as PaddingTools from '../../Components/PaddingTools';

const CardPaperRipple = (props) => <PaperRipple
	{...props}
	color={Colors.colorLuminance(Colors.LIGHT, -0.1)}
	opacity={0.2}
	rmConfig={{
		stiffness: 50,
		damping: 20,
	}}
/>;

const View = ({
	reviews,
}) => {
	return <div>
		<div className="main" id="Reviews">
			<ul className="card-collection">
				{
                    reviews.items.map(
						(rev, index) => <li
							key={index}
							className="card">

							<CardPaperRipple
								className="content"
								tag="div">
                                <div className="review">
                                    <h3>{rev.Name}</h3>
                                    <h5>{rev.Date}</h5>
                                    <p>{rev.Content}</p>
                                </div>
							</CardPaperRipple>
						</li>
					)
				}
				{
					PaddingTools.addPadding(3, reviews.items.length).map(
						(_, i) => <li key={i} className="card empty"/>)
				}
			</ul>
		</div>
	</div>;
};

export default View;

/*
 * Copyright (C) 2022       Ansh Goyal
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import * as bootstrap from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import request from 'superagent';

const {Alert} = bootstrap;

interface PropsType {
	alertDetails?: string;
	alertType?: string;
	cbPermission: string;
};

interface StatesType {
	alertDetails: string;
	alertType: string;
	cbPermission: string;
};

interface ShowOptionsType {
	details: string;
	service: string;
	title: string;
	value: string;
}

function ExternalServices({alertDetails, alertType, cbPermission}: PropsType): React.JSX.Element {
	const [states, updateStates] =React.useState<StatesType>({
		alertDetails: alertDetails,
		alertType: alertType,
		cbPermission: cbPermission
	});
	const ShowServiceOption = (optionData: ShowOptionsType) => {
		const {
			service, value, title, details
		} = optionData;
		return (
			<div
				className={`external-service-option ${value === 'disable' ? 'disable' : ''}`}
			>
				<input
					checked={cbPermission === value}
					id={`${service}-${value}`}
					type="radio"
					value={value}
					onChange={handleClick}
				/>
				<label htmlFor={`${service}-${value}`}>
					<div className="title">
						{title}
					</div>
					<div className="details">
						{details}
					</div>
				</label>
			</div>
		);
	};

	const showAlert = (alertType) => {
		if (alertType === 'success') {
			return (
				<Alert variant="success">
					<strong>Success! {alertDetails}</strong>
				</Alert>
			);
		}
		else if (alertType === 'danger') {
			return (
				<Alert variant="danger">
					<strong>Error! {alertDetails}</strong>
				</Alert>
			);
		}
		return null;
	};

	const handleClick = async (event: React.FormEvent<HTMLInputElement>) => {
		if (event.target.value === 'review') {
			const data = await request.post('/external-service/critiquebrainz/connect');
			if (data.statusCode === 200) {
				window.location.href = data.text;
			}
			else {
				updateStates((prevStates: StatesType) => ({
					...prevStates,
					alertDetails: 'Something went wrong. Please try again.',
					alertType: 'danger'
				}));
			}
		}
		else {
			const data = await request.post('/external-service/critiquebrainz/disconnect');
			updateStates((prevStates: StatesType) => ({
				...prevStates,
				alertDetails: data.body.alertDetails,
				alertType: data.body.alertType
			}));
			if (data.statusCode === 200) {
				updateStates((prevStates: StatesType) => ({
					...prevStates,
					cbPermission: 'disable'
				}));
			}
		}
	};

	return (
		<div>
			{showAlert(alertType)}
			<div className="page-header"><h1>Connect with third-party services</h1></div>
			<div className="card">
				<div className="card-header">
					<h3 className="card-title">CritiqueBrainz</h3>
				</div>
				<div className="card-body">
					<p>
						Connect to your CritiqueBrainz account to publish reviews directly from BookBrainz.
						Your reviews will be independently visible on CritiqueBrainz and appear publicly
						on your CritiqueBrainz profile unless removed. To view or delete your reviews, visit your
						CritiqueBrainz profile.
					</p>
					<br/>
					<ShowServiceOption
						details="You will be able to publish reviews directly from BookBrainz."
						service="critiquebrainz"
						title="Reviews"
						value="review"
					/>
					<ShowServiceOption
						details="You will not be able to publish reviews directly from BookBrainz."
						service="critiquebrainz"
						title="Disable"
						value="disable"
					/>
				</div>
			</div>
		</div>
	);
};

ExternalServices.displayName = 'ExternalServices';
ExternalServices.propTypes = {
	alertDetails: PropTypes.string,
	alertType: PropTypes.string,
	cbPermission: PropTypes.string.isRequired
};
ExternalServices.defaultProps = {
	alertDetails: '',
	alertType: false
};


export default ExternalServices;

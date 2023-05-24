import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import lookUpService from 'services/lookUpService';
import toastr from 'toastr';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import SideNavBar from 'components/sidenavbar/SideNavBar';
import apparelSizesService from '../../services/apparelSizesService';

function ApparelForm({ currentUser }) {
	const lookUptables = ['ApparelSizes'];
	const _logger = debug.extend('apparel');
	_logger(currentUser.id);
	const [getSizes, setGetSizes] = useState({ male: [], female: [] });
	const [formData, setFormData] = useState({
		shirtSize: null,
		jacketSize: null,
		shoeSize: null,
		hatSize: null,
		pantsWaist: null,
		pantsSize: null,
		statusTypeId: 1,
	});
	useEffect(() => {
		lookUpService
			.lookUp3Col(lookUptables)
			.then(onLookUpSuccess)
			.catch(onLookUpError);
	}, []);

	useEffect(() => {
		apparelSizesService
			.getById(currentUser.id)
			.then(onGetUserSuccess)
			.catch(onGetUserError);
	}, []);

	const onLookUpSuccess = (response) => {
		_logger('onLookUpSuccess', response.items);
		function mapMaleOptions(obj) {
			if (obj.code === 'Male') {
				return (
					<option key={obj.id} value={obj.id}>
						{obj.name}
					</option>
				);
			}
		}
		function mapFemaleOptions(obj) {
			if (obj.code === 'Female') {
				return (
					<option key={obj.id} value={obj.id}>
						{obj.name}
					</option>
				);
			}
		}

		setGetSizes((prevState) => {
			const setData = { ...prevState };
			setData.male = response.items.map(mapMaleOptions);
			setData.female = response.items.map(mapFemaleOptions);
			return setData;
		});
	};

	function createSizeOptions() {
		return (
			<>
				<option value=''> Select Size </option>
				<option value=''> --Male Sizes-- </option>
				{getSizes.male}
				<option value=''> --Female Sizes-- </option>
				{getSizes.female}
			</>
		);
	}
	const onLookUpError = () => {
		toastr['error']('Failed to get User Sizes', 'An Error Occurred');
	};

	const onGetUserSuccess = (response) => {
		_logger('onGetUserSuccess', response);
		const data = response.item;
		setFormData((prevState) => {
			const setData = { ...prevState };

			setData.shirtSize = data.shirtSize.id === 0 ? null : data.shirtSize.id;
			setData.jacketSize = data.jacketSize.id === 0 ? null : data.jacketSize.id;
			setData.shoeSize = data.shoeSize === 0 ? null : data.shoeSize;
			setData.hatSize = data.hatSize.id === 0 ? null : data.hatSize.id;
			setData.pantsWaist = data.pantsWaist === 0 ? null : data.pantsWaist;
			setData.pantsSize = data.pantsSize.id === 0 ? null : data.pantsSize.id;
			setData.id = data.id;
			return setData;
		});
	};
	const onGetUserError = (err) => {
		const errorCode = err.response.status;
		if (errorCode !== 404) {
			toastr['error']('Unexpected error. Please try again', 'User Error');
		}
	};

	const onSubmitHandler = (values) => {
		if (formData.id) {
			_logger('updating', formData.id);
			const nullableValue = {};

			for (let [key, value] of Object.entries(values)) {
				if (value === '') {
					value = null;
				}
				nullableValue[key] = value;
			}
			_logger(nullableValue, 'all not null values');
			apparelSizesService
				.update(nullableValue, formData.id)
				.then(onUpdateSuccess)
				.catch(onUpdateError);
		} else {
			_logger('adding', values);
			apparelSizesService.add(values).then(onAddSuccess).catch(onAddError);
		}
	};

	const onUpdateSuccess = (response) => {
		_logger('onUpdateSuccess', response);
		toastr['success']('Sizes updated successfully', 'Update Success');
	};
	const onUpdateError = (err) => {
		_logger('onUpdateError', err);
		toastr['error']('Unexpected error. Please try again', 'Update Error');
	};

	const onAddSuccess = () => {
		toastr['success']('Sizes added successfully', 'Add Success');
	};
	const onAddError = (err) => {
		_logger('onAddError', err);
		toastr['error']('Unexpected error. Please try again', 'Add Error');
	};

	return (
		<React.Fragment>
			<div className='container'>
				<div className='row'>
					<div className='col col-sm-3'>
						<SideNavBar />
					</div>
					<div className='col col-sm-8'>
						<div className='card'>
							<div className='m-3'>
								<h3>Apparel Sizes Detail</h3>
								<h5>Edit your sizes</h5>
							</div>
							<Formik
								enableReinitialize={true}
								initialValues={formData}
								onSubmit={onSubmitHandler}
							>
								<div>
									<Form className='m-3'>
										<div className='row'>
											<div className='col'>
												<div className='form-group'>
													<label className='mt-2' htmlFor='shirtSize'>
														Shirt Size
													</label>
													<Field
														className='form-control shadow-none'
														aria-autocomplete='off'
														name='shirtSize'
														as='select'
													>
														{createSizeOptions()}
													</Field>
												</div>
											</div>
											<div className='col'>
												<div className='form-group'>
													<label className='mt-2' htmlFor='jacketSize'>
														Jacket Size
													</label>
													<Field
														className='form-control shadow-none'
														aria-autocomplete='off'
														name='jacketSize'
														as='select'
													>
														{createSizeOptions()}
													</Field>
												</div>
											</div>
										</div>

										<div className='row'>
											<div className='col'>
												<div className='form-group'>
													<label className='mt-2' htmlFor='shoeSize'>
														Shoe Size
													</label>
													<Field
														className='form-control shadow-none'
														aria-autocomplete='off'
														name='shoeSize'
													/>
												</div>
											</div>
											<div className='col'>
												<div className='form-group'>
													<label className='mt-2' htmlFor='hatSize'>
														Hat Size
													</label>
													<Field
														className='form-control shadow-none'
														aria-autocomplete='off'
														name='hatSize'
														as='select'
													>
														{createSizeOptions()}
													</Field>
												</div>
											</div>
										</div>
										<div className='row'>
											<div className='col'>
												<div className='form-group'>
													<label className='mt-2' htmlFor='pantsWaist'>
														Pants Waist
													</label>
													<Field
														className='form-control shadow-none'
														aria-autocomplete='off'
														name='pantsWaist'
													/>
												</div>
											</div>
											<div className='col'>
												<div className='form-group'>
													<label className='mt-2' htmlFor='pantsSize'>
														Pants Size
													</label>
													<Field
														className='form-control shadow-none'
														aria-autocomplete='off'
														name='pantsSize'
														as='select'
													>
														{createSizeOptions()}
													</Field>
												</div>
											</div>
										</div>

										<button type='submit' className='btn btn-primary mt-3 mx-2'>
											Update Profile
										</button>
									</Form>
								</div>
							</Formik>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default ApparelForm;

ApparelForm.propTypes = {
	currentUser: PropTypes.shape({
		id: PropTypes.number.isRequired,
		isLoggedIn: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired,
		roles: PropTypes.arrayOf(PropTypes.string).isRequired,
	}),
};

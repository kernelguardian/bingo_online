import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateUniqueId } from './utils';
import './Home.css';

function Home() {
	const [maxNumberRange, setMaxNumberRange] = useState(75);
	const [numberOfCells, setNumberOfCells] = useState(5);
	const [errors, setErrors] = useState({
		maxNumberRange: false,
		numberOfCells: false,
	});
	const navigate = useNavigate();

	const validateInputs = () => {
		const errors = {
			maxNumberRange: false,
			numberOfCells: false,
		};
		if (numberOfCells < 5) {
			errors.numberOfCells = true;
		}
		if (numberOfCells * numberOfCells > maxNumberRange) {
			errors.maxNumberRange = true;
		}
		setErrors(errors);
		return !errors.maxNumberRange && !errors.numberOfCells;
	};

	const handleGenerate = () => {
		if (validateInputs()) {
			const uid = generateUniqueId();

			const url = `/bingo/${uid}`;
			const payload = maxNumberRange + '_' + numberOfCells;
			const redis_url = `${process.env.REACT_APP_KV_REST_API_URL}/set/${uid}/${payload}`;

			console.log(redis_url);

			fetch(redis_url, {
				headers: {
					Authorization: 'Bearer ' + process.env.REACT_APP_KV_REST_API_TOKEN,
				},
			})
				.then((response) => response.json())
				.then((data) => console.log(data));

			navigate(url);
		}
	};

	const inputClass = (hasError) =>
		`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
			hasError ? 'border-red shake' : 'border-gray-300'
		}`;

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center'>
			<div className='bg-white shadow-md rounded-lg p-8 max-w-lg w-full'>
				<h1 className='text-2xl font-bold mb-6 text-center'>
					Generate a new Bingo Game
				</h1>
				<div className='mb-4'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Numbers to use (eg 1-75):
					</label>
					<input
						type='number'
						value={maxNumberRange}
						onChange={(e) => setMaxNumberRange(e.target.value)}
						className={inputClass(errors.maxNumberRange)}
					/>
				</div>
				<div className='mb-6'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Table Size (eg 5x5):
					</label>
					<input
						type='number'
						value={numberOfCells}
						onChange={(e) => setNumberOfCells(e.target.value)}
						className={inputClass(errors.numberOfCells)}
					/>
				</div>
				<button
					onClick={handleGenerate}
					className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 transition-colors'
				>
					Generate Bingo Link
				</button>
			</div>
		</div>
	);
}

export default Home;

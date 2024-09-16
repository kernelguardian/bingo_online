import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateUniqueId } from './utils';
// import { createClient } from 'redis';

function Home() {
	// const redis = createClient();
	// redis.on('error', (err) => console.log('Redis Client Error', err));
	// redis.connect();
	// console.log(process.env.REACT_APP_KV_URL);

	const [maxNumberRange, setMaxNumberRange] = useState(75);
	const [numberOfCells, setNumberOfCells] = useState(5);
	const navigate = useNavigate();

	const handleGenerate = () => {
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
	};

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center'>
			<div className='bg-white shadow-md rounded-lg p-8 max-w-lg w-full'>
				<h1 className='text-2xl font-bold mb-6 text-center'>
					Create Bingo Game
				</h1>
				<div className='mb-4'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Max Number Range:
					</label>
					<input
						type='number'
						value={maxNumberRange}
						onChange={(e) => setMaxNumberRange(e.target.value)}
						className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					/>
				</div>
				<div className='mb-6'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Number of Cells:
					</label>
					<input
						type='number'
						value={numberOfCells}
						onChange={(e) => setNumberOfCells(e.target.value)}
						className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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

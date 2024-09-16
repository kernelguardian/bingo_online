import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// Test
const BingoBoard = () => {
	const { id } = useParams(); // Access the dynamic parameter
	const [maxNumberRange, setMaxNumberRange] = useState(75);
	const [numberOfCells, setNumberOfCells] = useState(5);
	const [username, setUsername] = useState('');
	const [showModal, setShowModal] = useState(true); // Modal is shown when the page loads
	const [bingoNumbers, setBingoNumbers] = useState([]);
	const [clickedCells, setClickedCells] = useState([]);

	// Fetch configuration data from Redis on component mount
	useEffect(() => {
		const fetchData = async () => {
			const redisUrl = `${process.env.KV_REST_API_URL}/get/${id}`;
			console.log('Fetching from:', redisUrl);

			try {
				const response = await fetch(redisUrl, {
					headers: {
						Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				console.log('Fetched data:', data);

				const [maxRange, numCells] = data['result'].split('_');
				setMaxNumberRange(parseInt(maxRange, 10) || 75);
				setNumberOfCells(parseInt(numCells, 10) || 5);
			} catch (error) {
				console.error('Error fetching data:', error);
				// Optionally, you can set default values or show an error message
			}
		};

		fetchData();
	}, [id]); // Fetch data when the component mounts or id changes

	// Generate bingo numbers based on the number of cells
	const generateBingoNumbers = useCallback(() => {
		let numbers = [];
		while (numbers.length < numberOfCells * numberOfCells) {
			let randNum = Math.floor(Math.random() * maxNumberRange) + 1;
			if (!numbers.includes(randNum)) {
				numbers.push(randNum);
			}
		}
		setBingoNumbers(numbers);
		setClickedCells(Array(numberOfCells * numberOfCells).fill(false));
	}, [maxNumberRange, numberOfCells]);

	useEffect(() => {
		generateBingoNumbers();
	}, [generateBingoNumbers]); // Regenerate bingo numbers when maxNumberRange or numberOfCells changes

	// Function to handle username submission
	const handleUsernameSubmit = (e) => {
		e.preventDefault();
		if (username.trim()) {
			setShowModal(false);
		}
	};

	// Toggle the clicked state of the cell
	const handleCellClick = (index) => {
		const updatedClickedCells = [...clickedCells];
		updatedClickedCells[index] = !updatedClickedCells[index];
		setClickedCells(updatedClickedCells);
	};

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center relative'>
			{/* Username Modal */}
			{showModal && (
				<div className='absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg z-50'>
						<h2 className='text-xl font-bold mb-4 text-center'>
							Enter your username
						</h2>
						<form
							onSubmit={handleUsernameSubmit}
							className='flex flex-col items-center'
						>
							<input
								type='text'
								placeholder='Your name'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='border border-gray-300 rounded-lg p-2 w-64 mb-4'
							/>
							<button
								type='submit'
								className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
							>
								Submit
							</button>
						</form>
					</div>
				</div>
			)}

			{/* Bingo Game */}
			<div className='bg-white shadow-md rounded-lg p-8'>
				<h1 className='text-2xl font-bold mb-6 text-center'>Bingo Board</h1>
				{/* Display Username */}
				{username && (
					<h2 className='text-xl mb-4 text-center'>Player: {username}</h2>
				)}

				<div
					className={`grid grid-cols-${numberOfCells} gap-4`}
					style={{
						gridTemplateColumns: `repeat(${numberOfCells}, minmax(0, 1fr))`,
					}}
				>
					{bingoNumbers.map((number, index) => (
						<div
							key={index}
							onClick={() => handleCellClick(index)}
							className={`flex items-center justify-center h-16 w-16 bg-indigo-200 text-indigo-800 font-semibold text-xl border border-gray-300 rounded-md shadow cursor-pointer transition-transform transform ${
								clickedCells[index] ? 'bg-red-300 line-through' : ''
							}`}
						>
							{number}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BingoBoard;

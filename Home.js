import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
	const [maxNumberRange, setMaxNumberRange] = useState(75);
	const [numberOfCells, setNumberOfCells] = useState(5);
	const navigate = useNavigate();

	const handleGenerate = () => {
		// Redirect to BingoBoard with query params
		const url = `/bingo?maxNumberRange=${maxNumberRange}&numberOfCells=${numberOfCells}`;
		navigate(url);
	};

	return (
		<div>
			<h1>Create Bingo Game</h1>
			<div>
				<label>Max Number Range:</label>
				<input
					type='number'
					value={maxNumberRange}
					onChange={(e) => setMaxNumberRange(e.target.value)}
				/>
			</div>
			<div>
				<label>Number of Cells:</label>
				<input
					type='number'
					value={numberOfCells}
					onChange={(e) => setNumberOfCells(e.target.value)}
				/>
			</div>
			<button onClick={handleGenerate}>Generate Bingo Link</button>
		</div>
	);
}

export default Home;

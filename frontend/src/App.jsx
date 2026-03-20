import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dash from './pages/Dash';
  
function App() { 
  return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/dashboard' element={<Dash />} />
			</Routes>
		</BrowserRouter>
  );
}

export default App
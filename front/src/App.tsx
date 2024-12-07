import React from 'react';
import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Servicos from './pages/Servicos';
import Analise from './pages/Analise';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/clientes" element={<Clientes />} />
				<Route path="/produtos" element={<Produtos />} />
				<Route path="/servicos" element={<Servicos />} />
				<Route path="/analise" element={<Analise />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

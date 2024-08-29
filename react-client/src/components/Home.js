import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ProductList from './ProductList';

const Home = () => {
	const [editingProduct, setEditingProduct] = useState(null);
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

	const handleEdit = (product) => {
		console.log('Editing product:', product);
		setEditingProduct(product);
	};

	const handleSubmit = () => {
		console.log('Form submitted, resetting editingProduct');
		setEditingProduct(null);
	};

	if (!isAuthenticated) {
		return <h1>Leather Boots App</h1>;
	}

	return (
		<div>
			<h1>Leather Boots App</h1>
			<ProductList onEdit={handleEdit} editingProduct={editingProduct} onSubmit={handleSubmit} />
		</div>
	);
};

export default Home;

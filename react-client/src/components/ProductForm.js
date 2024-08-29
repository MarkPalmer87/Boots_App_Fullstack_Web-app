import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        color: '',
        price: '',
        sizes: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                price: product.price.toString(),
                sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes
            });
        } else {
            setFormData({
                name: '',
                brand: '',
                color: '',
                price: '',
                sizes: ''
            });
        }
    }, [product]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submittedData = {
            ...formData,
            price: parseFloat(formData.price),
            sizes: formData.sizes.split(',').map(size => size.trim()).filter(size => size !== '')
        };
        onSubmit(submittedData);
        setFormData({ name: '', brand: '', color: '', price: '', sizes: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
            />
            <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Brand"
                required
            />
            <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Color"
                required
            />
            <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                step="0.01"
                required
            />
            <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="Sizes (comma-separated, e.g., 7, 7.5, 8)"
                required
            />
            <button type="submit">{product ? 'Update' : 'Add'} Product</button>
        </form>
    );
};

export default ProductForm;

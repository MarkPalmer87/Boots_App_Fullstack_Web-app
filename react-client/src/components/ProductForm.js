import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        color: '',
        price: '',
        sizes: []
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                brand: product.brand || '',
                color: product.color || '',
                price: product.price ? product.price.toString() : '',
                sizes: Array.isArray(product.sizes) ? product.sizes : []
            });
        } else {
            setFormData({
                name: '',
                brand: '',
                color: '',
                price: '',
                sizes: []
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSizesChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            sizes: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submittedData = {
            ...formData,
            price: parseFloat(formData.price),
            sizes: formData.sizes.split(',').map(size => size.trim()).filter(size => size !== '').map(Number).filter(size => !isNaN(size))
        };
        onSubmit(submittedData);
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
                required
            />
            <input
                type="text"
                name="sizes"
                value={Array.isArray(formData.sizes) ? formData.sizes.join(', ') : formData.sizes}
                onChange={handleSizesChange}
                placeholder="Sizes (comma-separated)"
                required
            />
            <button type="submit">{product ? 'Update' : 'Add'} Product</button>
        </form>
    );
};

export default ProductForm;

import axios from 'axios';

// Update the port to 5001 to match your working backend
const API_URL = 'http://localhost:5001/api/items';

export const getItems = () => axios.get(API_URL);
export const addItem = (item) => axios.post(API_URL, item);
export const deleteItem = (id) => axios.delete(`${API_URL}/${id}`);
export const updateItem = (id, updatedItem) => axios.put(`${API_URL}/${id}`, updatedItem);
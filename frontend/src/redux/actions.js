import axios from 'axios';

export const fetchShipments = () => async dispatch => {
  const res = await axios.get('http://localhost:5000/api/shipments');
  dispatch({ type: 'SET_SHIPMENTS', payload: res.data });
};

export const createShipment = (data) => async dispatch => {
  await axios.post('http://localhost:5000/api/shipment', data);
  dispatch(fetchShipments());
};

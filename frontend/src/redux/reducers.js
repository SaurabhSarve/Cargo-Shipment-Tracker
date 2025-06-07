const initialState = {
  shipments: []
};

export const shipmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SHIPMENTS':
      return { ...state, shipments: action.payload };
    default:
      return state;
  }
};

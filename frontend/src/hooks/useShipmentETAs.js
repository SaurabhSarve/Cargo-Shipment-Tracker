import { useState, useEffect } from 'react';
import axios from 'axios';

const useShipmentETAs = (shipments) => {
  const [etaMap, setEtaMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchETAs = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          shipments.map(async (s) => {
            try {
              const res = await axios.get(`${process.env.REACT_APP_API_URL}/shipment/${s._id}/eta`);
              return { id: s._id, eta: res.data.eta };
            } catch (err) {
              console.warn(`ETA fetch failed for shipment ${s.shipmentId}:`, err.response?.data || err.message);
              return { id: s._id, eta: null };
            }
          })
        );
        const map = {};
        results.forEach((r) => {
          if (r.eta) map[r.id] = r.eta;
        });
        setEtaMap(map);
      } catch (err) {
        console.error('ETA fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shipments.length > 0) {
      fetchETAs();
    }
  }, [shipments]);

  return { etaMap, loading };
};

export default useShipmentETAs;

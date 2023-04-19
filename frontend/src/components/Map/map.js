import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './map.css';
import { useHistory } from 'react-router-dom';

mapboxgl.accessToken = 'pk.eyJ1IjoiY29tbWFuZGVyemVlIiwiYSI6ImNsZ255Y2pmZTA3OXAzbXFtNHB4aWp0bnMifQ.trObNVmB1uTEBgPkINgUfg';

const MapComponent = ({ spots }) => {
  const mapContainer = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
    });

    map.on('load', () => {
      spots.forEach((spot) => {
        const popup = new mapboxgl.Popup()
          .setHTML(`
            <h3>${spot.name}</h3>
            <img src="${spot.previewImage}" alt="${spot.name}" style="width: 100%; height: auto;" onclick="location.href='/spots/${spot.id}'"/>
            <p>${spot.price} / night</p>
          `)
          .on('click', () => {
            history.push(`/spots/${spot.id}`);
          });

        const marker = new mapboxgl.Marker()
          .setLngLat([spot.lng, spot.lat])
          .setPopup(popup)
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [spots, history]);

  return (
    <div>
      <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default MapComponent;

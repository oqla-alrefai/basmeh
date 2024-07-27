import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = () => {
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Get current location and center map on it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ lat: latitude, lng: longitude });
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13); // Adjust zoom level as needed
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // Handle error here (e.g., fallback to a default location or show a message)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Handle case where Geolocation is not supported
    }
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: searchQuery,
          format: 'json',
          limit: 1
        }
      });
      const result = response.data[0];
      if (result) {
        const { lat, lon } = result;
        const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPosition);
        setSearchResult(result);
        if (mapRef.current) {
          mapRef.current.setView([newPosition.lat, newPosition.lng], 13); // Adjust zoom level as needed
        }
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error("Error during search:", error);
      alert('Error searching for location');
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  };

  const googleMapsLink = position
    ? `https://www.google.com/maps/?q=${position.lat},${position.lng}`
    : null;

  return (
    <div>
      <h3>Select your location by clicking on the map or searching</h3>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a location"
      />
      <button onClick={handleSearch}>Search</button>
      <MapContainer
        center={position ? [position.lat, position.lng] : [31.9552, 35.9450]} // Default to Amman
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
      {position && (
        <div style={{ marginTop: '10px' }}>
          <p>Selected Location:</p>
          <p>Latitude: {position.lat}</p>
          <p>Longitude: {position.lng}</p>
          <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
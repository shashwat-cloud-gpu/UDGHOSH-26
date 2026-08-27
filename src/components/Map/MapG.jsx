import React from 'react'
import style from './MapG.css'

const MapG = () => {
  return (
    <div className='mapFrame'>
        <div className="mapContainer">
            <iframe className="map" src="https://www.google.com/maps/d/u/0/embed?mid=1qg0HCpuw8rWnq7g2sW8WYoSmoP7_k6M&ehbc=2E312F&noprof=1" width="640" height="480"></iframe>
        </div>
    </div>
  )
}

export default MapG
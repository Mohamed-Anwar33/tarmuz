import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
  address?: string;
}

const Map: React.FC<MapProps> = ({ lat, lng, zoom = 15, title = "موقعنا", address }) => {
  const mapRef = useRef<L.Map | null>(null);

  // علامة بسيطة ودقيقة
  const customIcon = L.divIcon({
    html: `
      <div style="position: relative; width: 20px; height: 20px;">
        <div style="position: absolute; top: 0; left: 0; width: 20px; height: 20px; background: #ef4444; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 10px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>
        <div style="position: absolute; top: 50%; left: 50%; width: 4px; height: 4px; background: white; border-radius: 50%; transform: translate(-50%, -50%);"></div>
      </div>
    `,
    className: 'simple-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10], // المنتصف الدقيق
    popupAnchor: [0, -15]
  });

  if (!lat || !lng) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">لم يتم تحديد الموقع</p>
          <p className="text-gray-400 text-sm mt-1">يرجى إضافة إحداثيات الموقع</p>
        </div>
      </div>
    );
  }

  const center: [number, number] = [lat, lng];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-gray-200">
      {/* طبقة تدرج علوية للمظهر الأنيق */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/20 to-transparent z-[1000] pointer-events-none"></div>
      
      {/* مؤشر "مباشر" محسن */}
      <div className="absolute top-4 right-4 z-[1001] bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl animate-pulse hover:scale-105 transition-transform cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          <span className="animate-pulse">مباشر</span>
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* زر فتح في خرائط جوجل */}
      <div className="absolute top-4 left-4 z-[1001]">
        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-3 py-2 rounded-lg text-xs font-medium shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
          فتح في خرائط جوجل
        </a>
      </div>

      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
        zoomControl={false}
        className="rounded-xl"
      >
        {/* طبقة الخريطة الفاتحة الأنيقة */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* العلامة المخصصة */}
        <Marker position={center} icon={customIcon}>
          <Popup 
            className="custom-popup"
            closeButton={false}
            offset={[0, -10]}
          >
            <div className="bg-white rounded-lg p-4 shadow-xl border-0 min-w-[200px]">
              <div className="text-center">
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{title}</h3>
                {address && (
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{address}</p>
                )}
                <div className="flex justify-center">
                  <a
                    href={`https://www.google.com/maps?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    عرض الاتجاهات
                  </a>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* أزرار التكبير والتصغير المحسنة */}
      <div className="absolute bottom-4 right-4 z-[1001] flex flex-col gap-3">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white w-12 h-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-12 flex items-center justify-center font-bold text-xl border-2 border-white/20 cursor-pointer"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white w-12 h-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12 flex items-center justify-center font-bold text-xl border-2 border-white/20 cursor-pointer"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" />
          </svg>
        </button>
        
        {/* زر إعادة التوسيط */}
        <button
          onClick={() => mapRef.current?.setView(center, zoom)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white w-12 h-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border-2 border-white/20 cursor-pointer"
          title="إعادة التوسيط"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* مؤشر الإحداثيات */}
      <div className="absolute bottom-4 left-4 z-[1001] bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
          <span>{lat.toFixed(4)}, {lng.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
};

export default Map;

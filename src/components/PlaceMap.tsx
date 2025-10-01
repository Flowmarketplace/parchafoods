interface PlaceMapProps {
  latitude: number;
  longitude: number;
  placeName: string;
  category: string;
}

const PlaceMap = ({ latitude, longitude, placeName }: PlaceMapProps) => {
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es&z=15&output=embed`;

  return (
    <iframe
      src={mapUrl}
      className="w-full h-full rounded-lg"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={`Mapa de ${placeName}`}
    />
  );
};

export default PlaceMap;

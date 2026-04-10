import { Short } from '@/types/short';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Heart, Eye, CheckCircle, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface ShortCardProps {
  short: Short;
}

const ShortCard = ({ short }: ShortCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleClick = () => {
    if (short.videoUrl) {
      setIsPlaying(true);
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  return (
    <>
      <Card 
        className="relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-background to-muted/20"
        onClick={handleClick}
      >
        <div className="relative aspect-[9/16] overflow-hidden bg-muted">
          {short.thumbnailUrl ? (
            <img 
              src={short.thumbnailUrl} 
              alt={short.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : short.videoUrl ? (
            <video
              src={`${short.videoUrl}#t=0.5`}
              muted
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="h-8 w-8 text-white fill-white ml-1" />
            </div>
          </div>

          <Badge className="absolute top-3 left-3 bg-black/70 text-white border-0">
            {short.category}
          </Badge>

          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <img 
                src={short.creator.avatarUrl} 
                alt={short.creator.name}
                className="w-10 h-10 rounded-full border-2 border-white/50"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm truncate">{short.creator.name}</p>
                  {short.creator.verified && (
                    <CheckCircle className="h-4 w-4 text-primary fill-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-white/80 truncate">{short.creator.username}</p>
              </div>
            </div>

            <h3 className="font-bold text-sm mb-1 line-clamp-2 leading-snug">
              {short.title}
            </h3>

            {short.placeName && (
              <p className="text-xs text-white/90 mb-2 flex items-center gap-1">
                📍 {short.placeName}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(short.views)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span>{formatNumber(short.likes)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Fullscreen Video Modal */}
      {isPlaying && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={handleClose}
        >
          <button
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            onClick={handleClose}
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <div className="absolute bottom-6 left-4 right-16 z-40 text-white pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <img src={short.creator.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-white/50" />
              <span className="font-semibold text-sm">{short.creator.name}</span>
              {short.creator.verified && <CheckCircle className="h-4 w-4 text-primary fill-primary" />}
            </div>
            <p className="font-bold text-sm">{short.title}</p>
            {short.placeName && <p className="text-xs opacity-80 mt-1">📍 {short.placeName}</p>}
          </div>

          <video
            ref={videoRef}
            src={short.videoUrl}
            autoPlay
            controls
            playsInline
            className="w-full h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ShortCard;

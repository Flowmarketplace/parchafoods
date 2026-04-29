import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SponsorLayout from '@/components/sponsor/SponsorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  Globe,
  Star,
  QrCode,
  Heart,
  MessageSquare,
  Image as ImageIcon,
  Bell,
  TrendingUp,
  Calendar,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

interface BusinessDetail {
  id: string;
  name: string;
  category: string;
  description: string | null;
  address: string;
  neighborhood: string;
  zone: string | null;
  phone: string | null;
  website: string | null;
  price_range: string | null;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
  loyalty_enabled: boolean;
  created_at: string;
}

interface Stats {
  qrScans: number;
  favorites: number;
  reviews: number;
  avgRating: number;
  promotions: number;
  images: number;
  shorts: number;
  proximityNotifs: number;
  uniqueVisitors: number;
}

const StatBox = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
}) => (
  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${color} shadow-sm`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SponsorBusinessStats = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [stats, setStats] = useState<Stats>({
    qrScans: 0,
    favorites: 0,
    reviews: 0,
    avgRating: 0,
    promotions: 0,
    images: 0,
    shorts: 0,
    proximityNotifs: 0,
    uniqueVisitors: 0,
  });
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data: biz, error: bizErr } = await supabase
          .from('businesses')
          .select(
            'id, name, category, description, address, neighborhood, zone, phone, website, price_range, featured, latitude, longitude, loyalty_enabled, created_at'
          )
          .eq('id', id)
          .maybeSingle();

        if (bizErr) throw bizErr;
        if (!biz) {
          toast.error('Restaurante no encontrado');
          navigate('/sponsor');
          return;
        }
        setBusiness(biz as BusinessDetail);

        const [
          scansRes,
          favsRes,
          reviewsRes,
          promosRes,
          imagesRes,
          shortsRes,
          proxRes,
          recentScansRes,
          reviewsListRes,
        ] = await Promise.all([
          supabase.from('loyalty_history').select('user_id', { count: 'exact' }).eq('business_id', id),
          supabase.from('user_favorites').select('*', { count: 'exact', head: true }).eq('business_id', id),
          supabase.from('business_reviews').select('rating').eq('business_id', id).eq('approved', true),
          supabase.from('business_promotions').select('*', { count: 'exact', head: true }).eq('business_id', id),
          supabase.from('business_images').select('*', { count: 'exact', head: true }).eq('business_id', id),
          supabase.from('business_shorts').select('*', { count: 'exact', head: true }).eq('business_id', id),
          supabase.from('proximity_notifications_sent').select('*', { count: 'exact', head: true }).eq('business_id', id),
          supabase
            .from('loyalty_history')
            .select('id, scanned_at, points_earned, scan_type')
            .eq('business_id', id)
            .order('scanned_at', { ascending: false })
            .limit(8),
          supabase
            .from('business_reviews')
            .select('id, author_name, rating, comment, created_at')
            .eq('business_id', id)
            .eq('approved', true)
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        const ratings = (reviewsRes.data || []).map((r: any) => r.rating);
        const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
        const uniqueUsers = new Set((scansRes.data || []).map((s: any) => s.user_id)).size;

        setStats({
          qrScans: scansRes.count || 0,
          favorites: favsRes.count || 0,
          reviews: ratings.length,
          avgRating: Number(avg.toFixed(1)),
          promotions: promosRes.count || 0,
          images: imagesRes.count || 0,
          shorts: shortsRes.count || 0,
          proximityNotifs: proxRes.count || 0,
          uniqueVisitors: uniqueUsers,
        });
        setRecentScans(recentScansRes.data || []);
        setReviews(reviewsListRes.data || []);
      } catch (e: any) {
        console.error(e);
        toast.error('Error cargando estadísticas');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) {
    return (
      <SponsorLayout title="Cargando..." subtitle="">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      </SponsorLayout>
    );
  }

  if (!business) return null;

  return (
    <SponsorLayout
      title={business.name}
      subtitle={`Estadísticas internas · ${business.category}`}
    >
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={() => navigate('/sponsor')} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Volver al dashboard
        </Button>

        {/* Header card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
          <CardContent className="relative p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Store className="h-3 w-3" /> {business.category}
                  </Badge>
                  {business.featured && (
                    <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-900">
                      <Star className="h-3 w-3 fill-amber-600" /> Destacado
                    </Badge>
                  )}
                  {business.price_range && (
                    <Badge variant="secondary">{business.price_range}</Badge>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">{business.name}</h2>
                {business.description && (
                  <p className="text-sm opacity-90 max-w-2xl line-clamp-2">{business.description}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-90 pt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {business.neighborhood}
                      {business.zone ? ` · ${business.zone}` : ''}
                    </span>
                  </div>
                  {business.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" /> {business.phone}
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a href={business.website} target="_blank" rel="noreferrer" className="underline">
                        Sitio web
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/business/${business.id}`)}
                className="gap-1"
              >
                Ver perfil público
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatBox
            icon={QrCode}
            label="Escaneos QR"
            value={stats.qrScans}
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          <StatBox
            icon={Users}
            label="Visitantes únicos"
            value={stats.uniqueVisitors}
            color="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
          <StatBox
            icon={Heart}
            label="Favoritos"
            value={stats.favorites}
            color="bg-gradient-to-br from-pink-500 to-rose-600"
          />
          <StatBox
            icon={Star}
            label="Calificación"
            value={stats.avgRating > 0 ? `${stats.avgRating} ★` : '—'}
            color="bg-gradient-to-br from-amber-500 to-orange-600"
          />
          <StatBox
            icon={MessageSquare}
            label="Reseñas"
            value={stats.reviews}
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatBox
            icon={TrendingUp}
            label="Promociones"
            value={stats.promotions}
            color="bg-gradient-to-br from-violet-500 to-purple-600"
          />
          <StatBox
            icon={ImageIcon}
            label="Galería · Shorts"
            value={`${stats.images} · ${stats.shorts}`}
            color="bg-gradient-to-br from-fuchsia-500 to-pink-600"
          />
          <StatBox
            icon={Bell}
            label="Notif. proximidad"
            value={stats.proximityNotifs}
            color="bg-gradient-to-br from-orange-500 to-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent scans */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <QrCode className="h-4 w-4 text-primary" /> Escaneos recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentScans.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  Aún no hay escaneos registrados.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentScans.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(s.scanned_at).toLocaleString()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        +{s.points_earned} pts · {s.scan_type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Reseñas recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  Aún no hay reseñas publicadas.
                </div>
              ) : (
                <div className="space-y-2">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg border bg-card space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{r.author_name}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < r.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{r.comment}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SponsorLayout>
  );
};

export default SponsorBusinessStats;

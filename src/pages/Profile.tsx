import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import { ArrowLeft, Star, Award, Camera, Copy, Share2, Gift } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  loyalty_points: number;
  referral_code: string | null;
  general_points: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
      } else {
        setTimeout(() => {
          loadProfile(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setReferralCode(data.referral_code || '');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios han sido guardados",
      });

      loadProfile(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file || !user) return;

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 2MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de imagen",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "¡Foto actualizada!",
        description: "Tu foto de perfil ha sido actualizada",
      });

      loadProfile(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast({
        title: "¡Código copiado!",
        description: "El código de referido ha sido copiado al portapapeles",
      });
    }
  };

  const shareReferralCode = async () => {
    if (!referralCode) return;

    const shareText = `¡Únete a la app con mi código de referido ${referralCode} y gana puntos!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Código de Referido',
          text: shareText,
        });
      } catch (error) {
        // User cancelled or share failed
        copyReferralCode();
      }
    } else {
      copyReferralCode();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="text-2xl">
                    {fullName.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div>
                <CardTitle>Mi Perfil</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Referral Card */}
            <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-primary/10 border-purple-500/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                    <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Recomienda y Gana</p>
                    <p className="text-sm text-muted-foreground">
                      Puntos generales: <span className="font-bold text-primary">{profile?.general_points || 0}</span>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Tu código de referido</Label>
                  <div className="flex gap-2">
                    <Input
                      value={referralCode}
                      readOnly
                      className="font-mono text-lg font-bold bg-background"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={copyReferralCode}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={shareReferralCode}
                      className="shrink-0"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Comparte tu código con amigos. Cuando se registren usando tu código, ¡ambos ganan puntos!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Points Card */}
            <Card 
              className="bg-gradient-to-br from-primary/10 to-secondary/10 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/my-loyalty')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Puntos Totales</p>
                    <p className="text-3xl font-bold text-primary">
                      {profile?.loyalty_points || 0}
                    </p>
                  </div>
                  <Award className="h-12 w-12 text-secondary" />
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/my-loyalty');
                  }}
                >
                  <Star className="h-4 w-4" />
                  Ver Mis Puntos por Local
                </Button>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

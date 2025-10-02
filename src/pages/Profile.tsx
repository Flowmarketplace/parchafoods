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
import { ArrowLeft, Star, Award, Camera, Share2, Copy, Check, Gift } from 'lucide-react';

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
  const [profile, setProfile] = useState<Profile | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [applyingReferral, setApplyingReferral] = useState(false);
  const [referralInput, setReferralInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setAvatarUrl(data.avatar_url);
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

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user!.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user!.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "¡Foto actualizada!",
        description: "Tu foto de perfil ha sido actualizada",
      });
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
      setCopied(true);
      toast({
        title: "¡Código copiado!",
        description: "Comparte este código con tus amigos",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralCode = async () => {
    if (referralCode && navigator.share) {
      try {
        await navigator.share({
          title: '¡Únete a nuestra app!',
          text: `Usa mi código de referido ${referralCode} para obtener puntos extra al registrarte`,
          url: window.location.origin,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      copyReferralCode();
    }
  };

  const applyReferralCode = async () => {
    if (!referralInput.trim() || !user) return;

    setApplyingReferral(true);

    try {
      // Find the referrer by code
      const { data: referrerData, error: referrerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralInput.trim().toUpperCase())
        .single();

      if (referrerError || !referrerData) {
        throw new Error('Código de referido no válido');
      }

      if (referrerData.id === user.id) {
        throw new Error('No puedes usar tu propio código');
      }

      // Check if user already used a referral
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_id', user.id)
        .single();

      if (existingReferral) {
        throw new Error('Ya has usado un código de referido');
      }

      // Create referral record
      const { error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerData.id,
          referred_id: user.id,
          points_awarded: 1
        });

      if (referralError) throw referralError;

      // Get current points and update
      const { data: referrerProfile } = await supabase
        .from('profiles')
        .select('general_points')
        .eq('id', referrerData.id)
        .single();

      if (referrerProfile) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            general_points: referrerProfile.general_points + 1
          })
          .eq('id', referrerData.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "¡Código aplicado!",
        description: "El referidor ha recibido un punto",
      });

      setReferralInput('');
      loadProfile(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setApplyingReferral(false);
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
              <div className="relative group">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl || ''} />
                  <AvatarFallback className="text-2xl">
                    {fullName.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <CardTitle>Mi Perfil</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General Points Card */}
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Puntos Generales</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {profile?.general_points || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Por referidos
                    </p>
                  </div>
                  <Gift className="h-12 w-12 text-green-600 dark:text-green-400" />
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
                    <p className="text-sm text-muted-foreground">Puntos de Lealtad</p>
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

            {/* Referral Section */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Recomienda a un Amigo
                </CardTitle>
                <CardDescription>
                  Comparte tu código y gana puntos cuando se registren
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={referralCode}
                    readOnly
                    className="font-mono text-lg font-bold"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyReferralCode}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  onClick={shareReferralCode}
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir Código
                </Button>

                <div className="pt-4 border-t">
                  <Label htmlFor="referralInput" className="text-sm font-medium">
                    ¿Tienes un código de referido?
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="referralInput"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                      placeholder="Ingresa el código"
                      className="font-mono"
                    />
                    <Button
                      onClick={applyReferralCode}
                      disabled={applyingReferral || !referralInput.trim()}
                      variant="secondary"
                    >
                      {applyingReferral ? 'Aplicando...' : 'Aplicar'}
                    </Button>
                  </div>
                </div>
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

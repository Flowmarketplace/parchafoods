import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { User, Session } from '@supabase/supabase-js';
import { Store, UserCircle, ArrowLeft, ShieldCheck, Megaphone } from 'lucide-react';

const emailSchema = z.string().trim().email({ message: "Email inválido" });
const passwordSchema = z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" });
const fullNameSchema = z.string().trim().min(2, { message: "El nombre debe tener al menos 2 caracteres" });

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginAccountType, setLoginAccountType] = useState<'customer' | 'business_owner' | 'sponsor' | 'seller' | 'admin'>('customer');

  // Signup form
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupBrandName, setSignupBrandName] = useState('');
  const [accountType, setAccountType] = useState<'customer' | 'business_owner' | 'sponsor' | 'seller'>('customer');

  // Password reset
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect after login/signup based on role
        if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          setTimeout(async () => {
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id);
            
            const isAdmin = roles?.some(r => r.role === 'admin');
            const isBusinessOwner = roles?.some(r => r.role === 'business_owner');
            const isSponsor = roles?.some(r => r.role === 'sponsor');
            const isSeller = roles?.some((r: any) => r.role === 'seller');
        const isSeller = roles?.some((r: any) => r.role === 'seller');
            
            if (isAdmin) {
              navigate('/admin');
            } else if (isBusinessOwner) {
              navigate('/business-dashboard');
            } else if (isSponsor) {
              navigate('/sponsor');
            } else if (isSeller) {
              navigate('/seller');
            } else {
              navigate('/');
            }
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
        
        const isAdmin = roles?.some(r => r.role === 'admin');
        const isBusinessOwner = roles?.some(r => r.role === 'business_owner');
        const isSponsor = roles?.some(r => r.role === 'sponsor');
        const isSeller = roles?.some((r: any) => r.role === 'seller');
        
        if (isAdmin) {
          navigate('/admin');
        } else if (isBusinessOwner) {
          navigate('/business-dashboard');
        } else if (isSponsor) {
          navigate('/sponsor');
        } else if (isSeller) {
          navigate('/seller');
        } else {
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Error",
            description: "Email o contraseña incorrectos",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data.user) {
        // Verificar que el rol coincida con el tipo de cuenta seleccionado
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id);
        
        const hasSelectedRole = roles?.some(r => r.role === loginAccountType);
        
        if (!hasSelectedRole) {
          // Si no tiene el rol seleccionado, cerrar sesión
          await supabase.auth.signOut();
          let errorMessage = "Esta cuenta no tiene los permisos correspondientes.";
          if (loginAccountType === 'business_owner') {
            errorMessage = "Esta cuenta no es de dueño de negocio. Por favor selecciona 'Cliente' o 'Admin'.";
          } else if (loginAccountType === 'admin') {
            errorMessage = "Esta cuenta no tiene permisos de administrador.";
          } else {
            errorMessage = "Esta cuenta no es de cliente. Por favor selecciona 'Dueño de Negocio' o 'Admin'.";
          }
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente",
          });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPassword);
      fullNameSchema.parse(signupFullName);

      if (signupPassword !== signupConfirmPassword) {
        toast({
          title: "Error",
          description: "Las contraseñas no coinciden",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const redirectUrl = `${window.location.origin}/`;

      const { data: signupData, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupFullName,
            role: accountType,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Error",
            description: "Este email ya está registrado. Intenta iniciar sesión.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // If sponsor, create sponsor profile (pending approval)
        if (accountType === 'sponsor' && signupData.user) {
          await supabase.from('sponsors').insert({
            user_id: signupData.user.id,
            brand_name: signupBrandName || signupFullName,
            contact_person: signupFullName,
            email: signupEmail,
            status: 'pendiente',
          });
          toast({
            title: "¡Solicitud enviada!",
            description: "Tu cuenta de patrocinador está pendiente de aprobación por el administrador.",
          });
        } else if (accountType === 'seller' && signupData.user) {
          await supabase.from('sellers').insert({
            user_id: signupData.user.id,
            full_name: signupFullName,
            email: signupEmail,
          });
          toast({
            title: "¡Cuenta de vendedor creada!",
            description: "Verifica tu correo e inicia sesión como Vendedor.",
          });
        } else {
          toast({
            title: "¡Cuenta creada!",
            description: "Tu cuenta ha sido creada exitosamente",
          });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse(resetEmail);

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email enviado",
          description: "Revisa tu correo para restablecer tu contraseña",
        });
        setShowResetPassword(false);
        setResetEmail('');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl text-center">Bienvenido</CardTitle>
          <CardDescription className="text-center">
            Inicia sesión o crea una cuenta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            {loginAccountType !== 'admin' && (
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="login">
              {!showResetPassword ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-3">
                    <Label>Iniciar sesión como</Label>
                    <RadioGroup
                      value={loginAccountType}
                      onValueChange={(value) => setLoginAccountType(value as any)}
                      className="grid grid-cols-5 gap-2"
                    >
                      <div>
                        <RadioGroupItem value="customer" id="login-customer" className="peer sr-only" />
                        <Label htmlFor="login-customer" className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                          <UserCircle className="mb-1 h-5 w-5" />
                          <span className="text-[10px] font-medium text-center">Cliente</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="business_owner" id="login-business" className="peer sr-only" />
                        <Label htmlFor="login-business" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                          <Store className="mb-1 h-5 w-5" />
                          <span className="text-[10px] font-medium text-center">Negocio</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="sponsor" id="login-sponsor" className="peer sr-only" />
                        <Label htmlFor="login-sponsor" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                          <Megaphone className="mb-1 h-5 w-5" />
                          <span className="text-[10px] font-medium text-center">Patrocinador</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="seller" id="login-seller" className="peer sr-only" />
                        <Label htmlFor="login-seller" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                          <Briefcase className="mb-1 h-5 w-5" />
                          <span className="text-[10px] font-medium text-center">Vendedor</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="admin" id="login-admin" className="peer sr-only" />
                        <Label htmlFor="login-admin" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                          <ShieldCheck className="mb-1 h-5 w-5" />
                          <span className="text-[10px] font-medium text-center">Admin</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-sm"
                    onClick={() => setShowResetPassword(true)}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-sm"
                    onClick={() => setShowResetPassword(false)}
                  >
                    Volver al inicio de sesión
                  </Button>
                </form>
              )}
            </TabsContent>

            {loginAccountType !== 'admin' && (
              <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-3">
                  <Label>Tipo de Cuenta</Label>
                  <RadioGroup
                    value={accountType}
                    onValueChange={(value) => setAccountType(value as 'customer' | 'business_owner' | 'sponsor' | 'seller')}
                    className="grid grid-cols-4 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="customer" id="customer" className="peer sr-only" />
                      <Label htmlFor="customer" className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <UserCircle className="mb-1 h-5 w-5" />
                        <span className="text-xs font-medium">Cliente</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="business_owner" id="business_owner" className="peer sr-only" />
                      <Label htmlFor="business_owner" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <Store className="mb-1 h-5 w-5" />
                        <span className="text-xs font-medium text-center">Negocio</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="sponsor" id="sponsor" className="peer sr-only" />
                      <Label htmlFor="sponsor" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <Megaphone className="mb-1 h-5 w-5" />
                        <span className="text-xs font-medium text-center">Patrocinador</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="seller" id="seller" className="peer sr-only" />
                      <Label htmlFor="seller" className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <Briefcase className="mb-1 h-5 w-5" />
                        <span className="text-xs font-medium text-center">Vendedor</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                {accountType === 'sponsor' && (
                  <div className="space-y-2">
                    <Label htmlFor="signup-brand">Nombre de la Marca</Label>
                    <Input
                      id="signup-brand"
                      type="text"
                      placeholder="Coca-Cola, Bavaria, etc."
                      value={signupBrandName}
                      onChange={(e) => setSignupBrandName(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Tu cuenta quedará pendiente de aprobación por el administrador.</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nombre Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirmar Contraseña</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

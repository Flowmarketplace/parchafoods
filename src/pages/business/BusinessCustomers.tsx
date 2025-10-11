import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import BusinessSidebar from '@/components/business/BusinessSidebar';
import BusinessBottomNav from '@/components/business/BusinessBottomNav';
import { 
  ArrowLeft,
  Users,
  Menu as MenuIcon,
  TrendingUp,
  Calendar,
  Award,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Customer {
  user_id: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
  };
  total_visits: number;
  total_points: number;
  last_visit: string;
  reward_claimed: boolean;
}

const BusinessCustomers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    returningCustomers: 0,
    newThisMonth: 0,
  });

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Get business
      const { data: businessData } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', session.user.id)
        .single();

      if (!businessData) {
        navigate('/business-dashboard');
        return;
      }

      setBusinessId(businessData.id);
      await fetchCustomers(businessData.id);
      await fetchStats(businessData.id);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async (businessId: string) => {
    try {
      // Get all loyalty points records for this business
      const { data: loyaltyData, error } = await supabase
        .from('loyalty_points')
        .select(`
          user_id,
          points,
          reward_claimed,
          last_scan_at,
          profiles (
            full_name,
            avatar_url,
            phone
          )
        `)
        .eq('business_id', businessId);

      if (error) throw error;

      // Get scan history for each customer
      const { data: historyData } = await supabase
        .from('loyalty_history')
        .select('user_id, scanned_at')
        .eq('business_id', businessId);

      // Process customer data
      const customerMap = new Map<string, Customer>();

      loyaltyData?.forEach((record: any) => {
        const userId = record.user_id;
        const visits = historyData?.filter(h => h.user_id === userId).length || 0;
        
        customerMap.set(userId, {
          user_id: userId,
          profile: record.profiles,
          total_visits: visits,
          total_points: record.points,
          last_visit: record.last_scan_at || new Date().toISOString(),
          reward_claimed: record.reward_claimed,
        });
      });

      // Convert map to array and sort by last visit
      const customersArray = Array.from(customerMap.values()).sort((a, b) => 
        new Date(b.last_visit).getTime() - new Date(a.last_visit).getTime()
      );

      setCustomers(customersArray);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchStats = async (businessId: string) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Total unique customers
      const { data: allCustomers } = await supabase
        .from('loyalty_points')
        .select('user_id')
        .eq('business_id', businessId);

      const totalCustomers = new Set(allCustomers?.map(c => c.user_id) || []).size;

      // New customers this month
      const { data: newCustomers } = await supabase
        .from('loyalty_points')
        .select('user_id')
        .eq('business_id', businessId)
        .gte('created_at', startOfMonth.toISOString());

      const newThisMonth = new Set(newCustomers?.map(c => c.user_id) || []).size;

      // Returning customers (more than 1 visit)
      const { data: allScans } = await supabase
        .from('loyalty_history')
        .select('user_id')
        .eq('business_id', businessId);

      const visitCounts = allScans?.reduce((acc: any, scan) => {
        acc[scan.user_id] = (acc[scan.user_id] || 0) + 1;
        return acc;
      }, {});

      const returningCustomers = Object.values(visitCounts || {}).filter((count: any) => count > 1).length;

      setStats({
        totalCustomers,
        returningCustomers,
        newThisMonth,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const name = customer.profile?.full_name?.toLowerCase() || '';
    const phone = customer.profile?.phone?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || phone.includes(query);
  });

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-16 lg:pb-0">
      <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:ml-64">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/business-dashboard')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Clientes</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:ml-64">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 animate-fade-in">
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">Clientes registrados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Recurrentes</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.returningCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">Con más de 1 visita</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Este Mes</CardTitle>
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Clientes nuevos</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Customers List */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              Clientes que han visitado tu establecimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No se encontraron clientes con ese criterio' : 'Aún no tienes clientes'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.user_id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-300"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(customer.profile?.full_name || null)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {customer.profile?.full_name || 'Usuario'}
                        </h3>
                        {customer.reward_claimed && (
                          <Badge variant="secondary" className="gap-1">
                            <Award className="h-3 w-3" />
                            Recompensa canjeada
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {customer.profile?.phone && (
                          <span>{customer.profile.phone}</span>
                        )}
                        <span>•</span>
                        <span>{customer.total_visits} {customer.total_visits === 1 ? 'visita' : 'visitas'}</span>
                        <span>•</span>
                        <span>{customer.total_points} puntos</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium">Última visita</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(customer.last_visit)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <BusinessBottomNav onMenuClick={() => setSidebarOpen(true)} />
    </div>
  );
};

export default BusinessCustomers;
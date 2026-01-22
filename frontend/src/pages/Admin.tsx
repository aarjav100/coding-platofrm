import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield, ArrowLeft, Loader2, Trash2, Plus, Calendar, Trophy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/api';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data States
  const [stats, setStats] = useState({ totalUsers: 0, totalProblems: 0, activeUsers: 0, totalSubmissions: 0 });
  const [problems, setProblems] = useState<any[]>([]);
  const [contests, setContests] = useState<any[]>([]);

  // Forms
  const [newProblem, setNewProblem] = useState({
    title: '', description: '', difficulty: 'Easy',
    constraints: '', inputFormat: '', outputFormat: '',
    testCases: [{ input: '', output: '', isPublic: true }]
  });

  const [newContest, setNewContest] = useState({
    title: '', description: '', startTime: '', endTime: '', problems: [] as string[]
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "Admin only.", variant: "destructive" });
        navigate('/');
      } else {
        fetchData();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, problemsRes, contestsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/problems'),
        api.get('/contests')
      ]);

      setStats(statsRes.data);
      setProblems(problemsRes.data);
      setContests(contestsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Problem Handlers ---
  const handleCreateProblem = async () => {
    try {
      await api.post('/problems', newProblem);
      toast({ title: "Success", description: "Problem created" });
      fetchData();
      setNewProblem({
        title: '', description: '', difficulty: 'Easy',
        constraints: '', inputFormat: '', outputFormat: '',
        testCases: [{ input: '', output: '', isPublic: true }]
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message, variant: "destructive" });
    }
  };

  const handleDeleteProblem = async (id: string) => {
    if (!confirm('Delete problem?')) return;
    try {
      await api.delete(`/problems/${id}`);
      toast({ title: "Success", description: "Problem deleted" });
      fetchData();
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  // --- Contest Handlers ---
  const handleCreateContest = async () => {
    try {
      // Basic validation
      if (!newContest.title || !newContest.startTime || !newContest.endTime) {
        toast({ title: "Error", description: "Fill required fields", variant: "destructive" });
        return;
      }

      await api.post('/contests', newContest);
      toast({ title: "Success", description: "Contest created" });
      fetchData();
      setNewContest({ title: '', description: '', startTime: '', endTime: '', problems: [] });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message, variant: "destructive" });
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}><ArrowLeft className="h-5 w-5" /></Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Manage platform</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" /> Administrator</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="contests">Contests</TabsTrigger>
          </TabsList>

          {/* DASHBOARD */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.totalUsers}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Users (7d)</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.activeUsers}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Problems</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.totalProblems}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Submissions</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.totalSubmissions}</div></CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PROBLEMS */}
          <TabsContent value="problems" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Create Problem</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Title" value={newProblem.title} onChange={e => setNewProblem({ ...newProblem, title: e.target.value })} />
                <Textarea placeholder="Description" value={newProblem.description} onChange={e => setNewProblem({ ...newProblem, description: e.target.value })} />
                <div className="flex gap-2">
                  <Input placeholder="Difficulty" value={newProblem.difficulty} onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value })} />
                  <Button onClick={handleCreateProblem}><Plus className="mr-2 h-4 w-4" /> Create</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Title</TableHead><TableHead>Difficulty</TableHead><TableHead>Actions</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {problems.map(p => (
                      <TableRow key={p._id}>
                        <TableCell>{p.title}</TableCell>
                        <TableCell><Badge variant="outline">{p.difficulty}</Badge></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProblem(p._id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTESTS */}
          <TabsContent value="contests" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Create Contest</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Contest Title" value={newContest.title} onChange={e => setNewContest({ ...newContest, title: e.target.value })} />
                <Textarea placeholder="Description" value={newContest.description} onChange={e => setNewContest({ ...newContest, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Start Time</span>
                    <Input type="datetime-local" value={newContest.startTime} onChange={e => setNewContest({ ...newContest, startTime: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">End Time</span>
                    <Input type="datetime-local" value={newContest.endTime} onChange={e => setNewContest({ ...newContest, endTime: e.target.value })} />
                  </div>
                </div>
                <Button onClick={handleCreateContest} className="w-full"><Trophy className="mr-2 h-4 w-4" /> Create Contest</Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contests.map(c => (
                <Card key={c._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      {c.title}
                      <Badge>{new Date(c.startTime) > new Date() ? 'Upcoming' : new Date(c.endTime) > new Date() ? 'Active' : 'Ended'}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(c.startTime).toLocaleDateString()}</div>
                    <div>Participants: {c.participants?.length || 0}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};
export default Admin;

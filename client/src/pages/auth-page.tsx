import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Leaf, Mail, KeyRound, User, AlertTriangle, Moon, Sun, ArrowRight, Sparkles, Shield, Zap, Brain } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const Background = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute inset-0">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-[600px] h-[600px] rounded-full bg-primary/2 blur-3xl animate-float`}
            style={{
              left: `${i === 0 ? '10%' : '60%'}`,
              top: `${i === 0 ? '20%' : '50%'}`,
              animationDelay: `${i * 5}s`,
            }}
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <div
            key={`pulse-${i}`}
            className="absolute w-32 h-32 rounded-full bg-primary/5 blur-xl animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, loginMutation, registerMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Handle login submit
  const onLoginSubmit = async (values: LoginFormData) => {
    setErrorMessage(null);
    try {
      await loginMutation.mutateAsync(values);
      navigate("/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao fazer login.");
    }
  };

  // Handle register submit
  const onRegisterSubmit = async (values: RegisterFormData) => {
    setErrorMessage(null);
    try {
      await registerMutation.mutateAsync(values);
      navigate("/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao criar conta.");
    }
  };

  // If user is already logged in, don't render the auth page
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative">
      <Background />
      
      {/* Theme toggle button */}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="fixed top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-accent transition-colors z-50"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-primary" />
        ) : (
          <Sun className="h-5 w-5 text-primary" />
        )}
      </button>
      
      {/* Left column with auth forms */}
      <div className="lg:w-1/2 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md backdrop-blur-sm bg-background/80 border-primary/20 group hover:border-primary/40 transition-all duration-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors duration-500">
                <Leaf className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Bem-vindo ao EcoBrain
            </CardTitle>
            <CardDescription className="group-hover:text-primary/80 transition-colors duration-500">
              Gerencie suas finanças de forma inteligente e sustentável
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4 animate-shake">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Tabs value={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" className="relative overflow-hidden">
                  Login
                  <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </TabsTrigger>
                <TabsTrigger value="register" className="relative overflow-hidden">
                  Registrar
                  <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuário</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                              <Input 
                                className="pl-9 transition-all duration-300 focus:border-primary/50 focus:ring-primary/20" 
                                placeholder="Seu nome de usuário" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                              <Input 
                                className="pl-9 transition-all duration-300 focus:border-primary/50 focus:ring-primary/20" 
                                type="password" 
                                placeholder="Sua senha" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full group relative overflow-hidden"
                      disabled={loginMutation.isPending}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {loginMutation.isPending ? "Entrando..." : "Entrar"}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <span className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </Button>
                  </form>
                </Form>
                <div className="text-center mt-4">
                  <Link href="#" className="text-sm text-primary hover:underline inline-flex items-center group">
                    Esqueceu sua senha?
                    <Sparkles className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome de usuário</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-9" 
                                placeholder="Escolha um nome de usuário" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-9" 
                                type="email" 
                                placeholder="seu.email@exemplo.com" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-9" 
                                type="password" 
                                placeholder="Crie uma senha forte" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-9" 
                                type="password" 
                                placeholder="Confirme sua senha" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-center text-sm text-muted-foreground">
            {tab === "login" ? (
              <p>
                Ainda não tem uma conta?{" "}
                <Button 
                  variant="link" 
                  className="p-0 group relative"
                  onClick={() => setTab("register")}
                >
                  Registre-se
                  <Sparkles className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </p>
            ) : (
              <p>
                Já tem uma conta?{" "}
                <Button 
                  variant="link" 
                  className="p-0 group relative"
                  onClick={() => setTab("login")}
                >
                  Faça login
                  <Sparkles className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Right column with hero image and features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background backdrop-blur-sm text-foreground p-8 flex-col justify-center relative z-10">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gerencie suas finanças de forma inteligente e sustentável
          </h1>
          <p className="text-lg mb-8 text-foreground/80">
            O EcoBrain é um sistema completo de gestão financeira pessoal que
            ajuda você a acompanhar suas despesas, planejar orçamentos, e alcançar
            suas metas financeiras com o poder da inteligência artificial.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">IA Inteligente</h3>
                <p className="text-foreground/80">Receba sugestões personalizadas para economizar e investir</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Segurança Avançada</h3>
                <p className="text-foreground/80">Proteção de dados com criptografia de ponta a ponta</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Painel Financeiro</h3>
                <p className="text-foreground/80">Visualize todas as suas finanças em um só lugar</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Automação Inteligente</h3>
                <p className="text-foreground/80">Categorização automática de transações com IA</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Metas Personalizadas</h3>
                <p className="text-foreground/80">Defina e acompanhe suas metas com sugestões da IA</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Análise Avançada</h3>
                <p className="text-foreground/80">Insights detalhados sobre seus gastos e economia</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center mb-2">
              <Brain className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold text-primary">Recursos de IA</h3>
            </div>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                Sugestões personalizadas de economia
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                Previsões de gastos futuros
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                Recomendações de investimentos
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                Análise de padrões de consumo
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these styles to your global CSS file
const styles = `
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(0) translateX(20px);
  }
  75% {
    transform: translateY(20px) translateX(10px);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-float {
  animation: float 10s infinite ease-in-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
`;

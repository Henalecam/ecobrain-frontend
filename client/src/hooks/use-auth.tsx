import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Conta mockada estática
const STATIC_USER = {
  id: 1,
  username: "usuario.demo",
  firstName: "Usuário",
  lastName: "Demo",
  email: "demo@ecobrain.com",
};

type User = typeof STATIC_USER;
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

type LoginData = { username: string; password: string };
type RegisterData = { username: string; password: string; email: string };

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para carregar o estado inicial

  // Carrega o estado inicial do usuário
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar estado do usuário:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialState();
  }, []);

  // Atualiza o localStorage quando o usuário muda
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const loginMutation = useMutation<User, Error, LoginData>({
    mutationFn: async (_credentials) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return STATIC_USER;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (user) => {
      setUser(user);
      setError(null);
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta, ${user.firstName || user.username}!`,
      });
    },
    onError: (error) => {
      setError(error);
      toast({
        title: "Falha no login",
        description: error.message || "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation<User, Error, RegisterData>({
    mutationFn: async (_userData) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return STATIC_USER;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (user) => {
      setUser(user);
      setError(null);
      toast({
        title: "Registro bem-sucedido",
        description: `Bem-vindo ao EcoBrain, ${user.firstName || user.username}!`,
      });
    },
    onError: (error) => {
      setError(error);
      toast({
        title: "Falha no registro",
        description: error.message || "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      setUser(null);
      setError(null);
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta.",
      });
    },
    onError: (error) => {
      setError(error);
      toast({
        title: "Falha no logout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

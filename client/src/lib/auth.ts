import { github, DATA_PATHS } from './github';
import type { User, InsertUser } from '@shared/schema';

export class AuthService {
  private static readonly STORAGE_KEY = 'furniture_store_user';

  static getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      // Try GitHub first, fallback to localStorage
      let users: User[] = [];
      
      try {
        users = await github.readJsonFile<User[]>(DATA_PATHS.users) || [];
      } catch (githubError) {
        console.warn('GitHub API not available, using localStorage fallback');
        // Fallback to localStorage
        const storedUsers = localStorage.getItem('furniture_store_users');
        if (storedUsers) {
          users = JSON.parse(storedUsers);
        } else {
          // Initialize default users in localStorage
          users = this.getDefaultUsers();
          localStorage.setItem('furniture_store_users', JSON.stringify(users));
        }
      }
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        this.setCurrentUser(user);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Erro ao verificar credenciais. Verifique sua conexão.');
    }
  }

  static async createUser(userData: InsertUser): Promise<User> {
    try {
      const users = await github.readJsonFile<User[]>(DATA_PATHS.users) || [];
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Usuário já existe com este email');
      }

      const newUser: User = {
        ...userData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      
      await github.writeJsonFile(
        DATA_PATHS.users,
        users,
        `Add new user: ${newUser.email}`
      );

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Erro ao criar usuário');
    }
  }

  private static getDefaultUsers(): User[] {
    return [
      {
        id: 'admin-1',
        email: 'admin@furniture.com',
        password: 'admin123',
        name: 'Administrador',
        type: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'loja-1',
        email: 'loja@furniture.com',
        password: 'loja123',
        name: 'Loja Demo',
        type: 'loja',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rest-1',
        email: 'restaurante@furniture.com',
        password: 'rest123',
        name: 'Restaurante Demo',
        type: 'restaurante',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  static async initializeDefaultUsers(): Promise<void> {
    try {
      // Try GitHub first
      try {
        const existingUsers = await github.readJsonFile<User[]>(DATA_PATHS.users);
        
        if (existingUsers && existingUsers.length > 0) {
          return; // Users already exist
        }

        const defaultUsers = this.getDefaultUsers();
        await github.writeJsonFile(
          DATA_PATHS.users,
          defaultUsers,
          'Initialize default users'
        );
      } catch (githubError) {
        console.warn('GitHub API not available, initializing users in localStorage');
        // Fallback to localStorage
        const storedUsers = localStorage.getItem('furniture_store_users');
        if (!storedUsers) {
          const defaultUsers = this.getDefaultUsers();
          localStorage.setItem('furniture_store_users', JSON.stringify(defaultUsers));
        }
      }
    } catch (error) {
      console.error('Error initializing default users:', error);
    }
  }
}

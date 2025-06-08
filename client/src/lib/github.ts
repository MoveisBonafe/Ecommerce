interface GitHubApiOptions {
  owner: string;
  repo: string;
  token: string;
}

interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
}

class GitHubAPI {
  private options: GitHubApiOptions;
  private baseUrl = 'https://api.github.com';

  constructor(options: GitHubApiOptions) {
    this.options = options;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}/repos/${this.options.owner}/${this.options.repo}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${this.options.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getFile(path: string): Promise<GitHubFileContent | null> {
    try {
      return await this.request(`/contents/${path}`);
    } catch (error) {
      if ((error as any).message?.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createOrUpdateFile(path: string, content: string, message: string, sha?: string): Promise<void> {
    const body: any = {
      message,
      content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
    };

    if (sha) {
      body.sha = sha;
    }

    await this.request(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async deleteFile(path: string, message: string, sha: string): Promise<void> {
    await this.request(`/contents/${path}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message,
        sha,
      }),
    });
  }

  async readJsonFile<T>(path: string): Promise<T | null> {
    const file = await this.getFile(path);
    if (!file) return null;

    try {
      const content = decodeURIComponent(escape(atob(file.content)));
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error parsing JSON file ${path}:`, error);
      return null;
    }
  }

  async writeJsonFile<T>(path: string, data: T, message: string): Promise<void> {
    const existingFile = await this.getFile(path);
    const content = JSON.stringify(data, null, 2);
    
    await this.createOrUpdateFile(path, content, message, existingFile?.sha);
  }
}

// GitHub API instance - will be configured dynamically
let githubInstance: GitHubAPI | null = null;

export const configureGitHub = (config: { owner: string; repo: string; token: string }) => {
  githubInstance = new GitHubAPI(config);
};

export const isGitHubConfigured = () => githubInstance !== null;

export const github = {
  getFile: (path: string) => githubInstance?.getFile(path) || Promise.reject(new Error('GitHub not configured')),
  createOrUpdateFile: (path: string, content: string, message: string, sha?: string) => 
    githubInstance?.createOrUpdateFile(path, content, message, sha) || Promise.reject(new Error('GitHub not configured')),
  deleteFile: (path: string, message: string, sha: string) => 
    githubInstance?.deleteFile(path, message, sha) || Promise.reject(new Error('GitHub not configured')),
  readJsonFile: <T>(path: string) => githubInstance?.readJsonFile<T>(path) || Promise.reject(new Error('GitHub not configured')),
  writeJsonFile: <T>(path: string, data: T, message: string) => 
    githubInstance?.writeJsonFile(path, data, message) || Promise.reject(new Error('GitHub not configured')),
};

// Data paths
export const DATA_PATHS = {
  users: 'docs/data/users.json',
  products: 'docs/data/products.json',
  categories: 'docs/data/categories.json',
  colors: 'docs/data/colors.json',
  pricingTables: 'docs/data/pricing-tables.json',
  promotions: 'docs/data/promotions.json',
  announcements: 'docs/data/announcements.json',
  orders: 'docs/data/orders.json',
} as const;

export type DataPath = keyof typeof DATA_PATHS;

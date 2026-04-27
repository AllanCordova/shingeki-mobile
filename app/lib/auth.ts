import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

export class AuthStorage {
  static async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  }

  static async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

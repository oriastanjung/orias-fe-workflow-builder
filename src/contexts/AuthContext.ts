import React from "react";

import type { User } from "@/types/user";

export type AuthContextType = {
  user: User | null;
  selectedRole: string;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  selectedRole: "",
  setUser: () => {},
  setSelectedRole: () => {},
});

export const AuthProvider = AuthContext.Provider;

export const useAuth = () => {
  return React.useContext(AuthContext);
};

import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../api/providerApi";

const ProviderAuthContext = createContext();

export const ProviderAuthProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("providerToken"));

  // persist token
  useEffect(() => {
    if (token) localStorage.setItem("providerToken", token);
    else localStorage.removeItem("providerToken");
  }, [token]);

  // rehydrate provider from API if we have a token but no provider
  useEffect(() => {
    (async () => {
      if (token && !provider) {
        try {
          const { data } = await getProfile(token);
          setProvider(data);
        } catch {
          // token might be invalid; clear it
          setToken(null);
          setProvider(null);
        }
      }
    })();
  }, [token]); // intentionally not depending on provider to avoid loops

  return (
    <ProviderAuthContext.Provider value={{ provider, setProvider, token, setToken }}>
      {children}
    </ProviderAuthContext.Provider>
  );
};

export const useProviderAuth = () => useContext(ProviderAuthContext);

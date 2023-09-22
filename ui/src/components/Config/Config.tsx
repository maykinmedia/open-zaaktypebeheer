import React from 'react';
import { useAsync } from 'react-use';
import { get } from '../../api/api';

export interface ConfigContextType {
  openzaakAdminUrl?: any;
  favicon?: string;
  logo?: string;
  oidcEnabled?: boolean;
  themeClassNames?: '';
  themeStyleSheet?: any;
  oidcLoginUrl?: string;
}

const ConfigContext = React.createContext<ConfigContextType>(null!);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const { value } = useAsync(async () => {
    const config: ConfigContextType = await get(`config/`);
    return config;
  }, []);

  return <ConfigContext.Provider value={{ ...value }}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return React.useContext(ConfigContext);
}

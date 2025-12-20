import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import ValidatePerson from "../components/validatePerson";
import CreateTramite from "../components/createTramite";

interface PersonData {
  [key: string]: any;
}

interface TramiteData {
  [key: string]: any;
}

interface TabConfig {
  name: string;
  render: ReactNode;
  rule?: Record<string, any>;
  ruleType?: string;
}

interface TramiteContextType {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  nextTab: (name: string, next: string) => void;
  person: PersonData;
  setPerson: React.Dispatch<React.SetStateAction<PersonData>>;
  tramite: TramiteData;
  setTramite: React.Dispatch<React.SetStateAction<TramiteData>>;
  complete: string[];
  setComplete: React.Dispatch<React.SetStateAction<string[]>>;
  Component: ReactNode;
}

export const TramiteContext = createContext<TramiteContextType>(
  {} as TramiteContextType
);

interface TramiteProviderProps {
  children?: ReactNode;
}

export const TramiteProvider: React.FC<TramiteProviderProps> = ({
  children,
}) => {
  const [tab, setTab] = useState<string>("validate");
  const [person, setPerson] = useState<PersonData>({});
  const [tramite, setTramite] = useState<TramiteData>({});
  const [complete, setComplete] = useState<string[]>([]);

  const tabs: Record<string, TabConfig> = {
    validate: {
      name: "validate",
      render: <ValidatePerson />,
      rule: person,
      ruleType: "object",
    },
    tramite: {
      name: "tramite",
      render: <CreateTramite />,
    },
  };

  const Component = useMemo(() => {
    const option = tabs[tab];
    if (!option) return null;
    return option.render;
  }, [tab, person]);

  const nextTab = (name: string, next: string) => {
    const newTab = tabs[name];
    const newNext = tabs[next];
    if (!newNext) return;
    if (!newTab) return;
    if (newTab.rule && typeof newTab.rule === newTab.ruleType) {
      const isRule = Object.keys(newTab.rule).length;
      if (!isRule) return;
    }
    setTab(next);
    setComplete((prev) => [...prev, name]);
  };

  useEffect(() => {
    setTab(tabs.validate.name);
  }, []);

  return (
    <TramiteContext.Provider
      value={{
        tab,
        setTab,
        nextTab,
        person,
        setPerson,
        tramite,
        setTramite,
        complete,
        setComplete,
        Component,
      }}
    >
      {children || null}
    </TramiteContext.Provider>
  );
};

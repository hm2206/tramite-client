import React, { createContext, useState, useMemo, useEffect } from 'react';
import ValidatePerson from '../components/validatePerson';
import CreateTramite from '../components/createTramite';

export const TramiteContext = createContext();

export const TramiteProvider = ({ children }) => {

    // estados
    const [tab, setTab] = useState();
    const [person, setPerson] = useState({});
    const [tramite, setTramite] = useState({});
    const [complete, setComplete] = useState([]);

    // menus
    const tabs = {
        validate: {
            name: "validate",
            render: <ValidatePerson/>,
            rule: person,
            ruleType: 'object'
        },
        tramite: {
            name: "tramite",
            render: <CreateTramite/>
        }
    };

    const Component = useMemo(() => {
        let option = tabs[tab];
        if (!option) return null;
        return option.render;
    }, [tab]);

    const nextTab = (name, next) => {
        let newTab = tabs[name];
        let newNext = tabs[next];
        if (!newNext) return;
        if (!newTab) return; 
        if (typeof newTab.rule == newTab.ruleType) {
            let isRule = Object.keys(newTab.rule).length;
            if (!isRule) return;
        }
        // setting 
        setTab(next);
        setComplete(prev => [...prev, name]);
    }

    useEffect(() => {
        setTab(tabs.validate.name);
    }, []);

    // render
    return (
        <TramiteContext.Provider value={{ tab, nextTab, person, setPerson, tramite, setTramite, complete, setComplete, Component }}>
            {children || null}
        </TramiteContext.Provider>

    )
}
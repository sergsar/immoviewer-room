import React, {useMemo} from 'react';

interface IAppContext {

}

const AppContext = React.createContext<IAppContext|null>(null)

export const AppContextProvider: ({ children }: { children: any }) => any = ({ children }) => {
    const context = useMemo(() => ({}), [])
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}
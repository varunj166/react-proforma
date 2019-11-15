import { createContext } from 'react';

export const ProformaContext = createContext({} as any);

export const ProformaContextProvider = ProformaContext.Provider;
export const ProformaContextConsumer = ProformaContext.Consumer;

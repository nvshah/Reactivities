import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
    activityStore: ActivityStore
}

export const store: Store = {
    activityStore: new ActivityStore()
}

export const StoreContext = createContext(store);   // this will be available in react context

// React Hook to use StoreConext inside func-component
export function useStore(){
    return useContext(StoreContext);
}
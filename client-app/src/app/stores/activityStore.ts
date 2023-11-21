import { makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../models/activity"
import agent from "../api/agent";

export default class ActivityStore{
    activities: Activity[] = [];
    selectedActivity: Activity | null = null;
    editMode = false;
    loading = false;
    //loadingInitial = false;
    //submitting = false;

    constructor(){
        // i auto identify which props to observe & what action is corresponding to it
        makeAutoObservable(this)  // auto observe & action bounding
    }

    loadActivities = async () => {
        this.loading = true 
        try {
            const response = await agent.Activities.list()
            runInAction(() => { // update to state(observable) must in action (STRICT-MODE-MOBX)
                response.forEach((a) => {
                    a.date = a.date.split('T')[0];
                    this.activities.push(a)
                })
                this.loading = false 
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false 
            })
        }

        
    }
}
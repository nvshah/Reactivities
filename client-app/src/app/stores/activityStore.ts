import { makeAutoObservable, runInAction } from "mobx"
import {v4 as uuid} from 'uuid';

import { Activity } from "../models/activity"
import agent from "../api/agent";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loadingInitial = true;
    submitting = false;
    //loadingInitial = false;
    //submitting = false;

    constructor(){
        // i auto identify which props to observe & what action is corresponding to it
        makeAutoObservable(this)  // auto observe & action bounding
    }

    /// computed property
    get activities(){
        let arr = Array.from(this.activityRegistry.values());
        return arr.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        this.setLoading(true)
        try {
            // //! Mocked Activities
            // await delay(2000)
            // const response = [
            //     {id:'1', category: 'drinks', city: 'ahmedabad', date: '', description: 'Desc', title: 'Event1', venue:'Kankaria'}, 
            //     {id:'2', category: 'drinks', city: 'ahmedabad', date: '', description: 'Desc', title: 'Event2', venue:'Iscon'}, 
            // ];
            const response = await agent.Activities.list()
            response.forEach((a) => {
                a.date = a.date.split('T')[0];
                this.activityRegistry.set(a.id, a);
            })
        } catch (error) {
            console.log(error);
        }
        this.setLoading(false)
    }

    setLoading = (isLoading: boolean) => {
        if(this.loadingInitial != isLoading){
            this.loadingInitial = isLoading
        }
    }

    // setSubmitting = (isSubmitting: boolean) => {
    //     if(this.submitting != isSubmitting){
    //         this.submitting = isSubmitting
    //     }
    // }

    // setEditMode = (mode: boolean) => {
    //     if(this.editMode != mode){
    //         this.loading = mode;
    //     }
    // }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined; 
    }

    /// Edit or Create Activity Form
    openForm = (id?: string) => {
        // remove any earlier opened activity form (if any) befroe creating new one 
        id ? this.selectActivity(id) : this.cancelSelectedActivity()
        //this.setEditMode(true);
        this.editMode = true;
    }

    closeForm = () => {
        // this.setEditMode(false);
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.submitting = true;
        activity.id = uuid()
        try {
            await agent.Activities.create(activity);  
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            });
            
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.submitting = false;
            });
        }
        
    }

    updateActivity = async (activity: Activity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);  
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            });
            
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.submitting = false;
            });
        }
    }

    deleteActivity = async (id: string) => {
        this.submitting = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                if (this.selectedActivity?.id == id){
                    this.cancelSelectedActivity();
                    this.editMode = false;
                }
                this.submitting = false;
            });
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.submitting = false;
            });
        } 
    }

}
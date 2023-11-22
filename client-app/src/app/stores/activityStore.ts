import { makeAutoObservable, runInAction } from "mobx"
import {v4 as uuid} from 'uuid';

import { Activity } from "../models/activity"
import agent from "../api/agent";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export default class ActivityStore{
    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    submitting = false;
    //loadingInitial = false;
    //submitting = false;

    constructor(){
        // i auto identify which props to observe & what action is corresponding to it
        makeAutoObservable(this)  // auto observe & action bounding
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
                this.activities.push(a)
            })
        } catch (error) {
            console.log(error);
        }
        this.setLoading(false)
    }

    setLoading = (isLoading: boolean) => {
        if(this.loading != isLoading){
            this.loading = isLoading
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
        this.selectedActivity = this.activities.find(x => x.id === id);
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
                this.activities.push(activity);
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
                this.activities = [...this.activities.filter(x => x.id !== activity.id), activity]
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
                this.activities = [...this.activities.filter(x => x.id !== id)]
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
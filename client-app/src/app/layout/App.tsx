import { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react';
import {v4 as uuid} from 'uuid';

import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDasbhoard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // console.log('Request Fired')
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach((a) => {
        a.date = a.date.split('T')[0];
        activities.push()
      })
      setActivities(response)
      setLoading(false);
    })

    // //! Mocked Activities
    // delay(2000).then(
    //     () => setActivities([{id:'1', category: 'drinks', city: 'ahmedabad', date: '', description: 'Desc', title: 'Event1', venue:'Kankaria'}, 
    //     {id:'2', category: 'drinks', city: 'ahmedabad', date: '', description: 'Desc', title: 'Event2', venue:'Iscon'}, 
    //   ])
    // );
  }, []);

  function handleSelectActivity(id: string){
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleUnselectActivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleUnselectActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    setSubmitting(true);
    if(activity.id){
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]); 
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    }else{
      activity.id = uuid()
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity ]); 
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    }    
  }

  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
  }

  if (loading) return <LoadingComponent content='Loading app...' />


  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectedActivity={handleUnselectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  )
}

export default App

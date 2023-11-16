import { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react';
import {v4 as uuid} from 'uuid';

import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDasbhoard';
import agent from '../api/agent';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // console.log('Request Fired')
    agent.Activities.list().then(response => {
      setActivities(response)
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
    activity.id
      ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
      : setActivities([...activities, {...activity, id: uuid()} ]); 
    
      setEditMode(false);
      setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string){
    setActivities([...activities.filter(x => x.id !== id)]);
  }


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
        />
      </Container>
    </>
  )
}

export default App

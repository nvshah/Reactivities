import { useEffect, useState } from 'react'
import axios from 'axios';
import { Container, List } from 'semantic-ui-react';
import { Activity } from '../models/Activity';
import NavBar from './NavBar';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // console.log('Request Fired')
    axios.get<Activity[]>('http://localhost:5000/api/activities')
    .then(response => {
      setActivities(response.data)
    })
  }, []);

  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <List>
          {
            activities.map(activity => (
              // for List must provide key to each item
              <List.Item key={activity.id}>
                {activity.title}
              </List.Item>
            ))
          }
        </List>
      </Container>
    </>
  )
}

export default App

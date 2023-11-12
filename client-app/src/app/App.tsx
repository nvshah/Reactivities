import { useEffect, useState } from 'react'
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // console.log('Request Fired')
    axios.get('http://localhost:5000/api/activities')
    .then(response => {
      setActivities(response.data)
    })
  }, []);

  return (
    <div>
      <Header as='h2' icon='users' content='Reactivities' />
      <List>
        {
          activities.map((activity: any) => (
            // for List must provide key to each item
            <List.Item key={activity.id}>
              {activity.title}
            </List.Item>
          ))
        }
      </List>
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities')
    .then(response => {
      setActivities(response.data)
    })
  }, []);

  return (
    <div>
      <h1>Reactivities</h1>
      <ul>
        {
          activities.map((activity: any) => (
            // for List must provide key to each item
            <li key={activity.id}>
              {activity.title}
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default App

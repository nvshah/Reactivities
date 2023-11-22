import { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";

import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";


function ActivityList(){
    const {activityStore} = useStore(); 
    const {activities, submitting, deleteActivity} = activityStore;

    const [target, setTarget] = useState('');  // This will persist state as its Hook

    function handleDeleteActivity(e: SyntheticEvent<HTMLButtonElement>, id: string){
        setTarget(e.currentTarget.name); // preserve state of button before deleting
        deleteActivity(id);
    }
    
    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => activityStore.selectActivity(activity.id)} floated="right" content="View" color="purple" />
                                <Button 
                                    name={activity.id} 
                                    loading={submitting && target === activity.id} 
                                    onClick={(e) => handleDeleteActivity(e, activity.id)} 
                                    floated="right" content="Delete" color="red" />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}

export default observer(ActivityList)
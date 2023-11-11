using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    public class ActivitiesController: BaseApiController
    {
        [HttpGet]  // api/activities
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]  // api/activities/{id}
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query{Id = id});
        }

        [HttpPost]  // api/activities
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            // NoTE: CreateActivity will get Activity obj as a param & APIController will help it to deduce this
            await Mediator.Send( new Create.Command{ Activity = activity } );
            return Ok();
        }

        [HttpPut("{id}")]  // api/activities/{id}
        public async Task<IActionResult> UpdateActivity(Guid id, Activity activity)
        {
            // As {activity} is meant to hold edited value & not real-entity residing in DB
            activity.Id = id;
            // NoTE: CreateActivity will get Activity obj as a param & APIController will help it to deduce this
            await Mediator.Send( new Edit.Command{ Activity = activity } );
            return Ok();
        }

        [HttpDelete("{id}")]  // api/activities/{id}
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            // NoTE: CreateActivity will get Activity obj as a param & APIController will help it to deduce this
            await Mediator.Send( new Delete.Command{ Id = id });
            return Ok();
        }

    }
}
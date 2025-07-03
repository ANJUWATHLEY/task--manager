import { useLocation, useNavigate } from "react-router-dom";

const ViewSingleTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task;

  if (!task) {
    return (
      <p className="text-center p-6 text-red-600 font-semibold">
        ❌ No task data found. Go back and try again.
      </p>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back to Tasks
      </button>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Task Details</h2>
        <h3 className="text-xl font-semibold text-blue-700">{task.title}</h3>

        <div className="mt-2 space-y-2 text-gray-700">
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Status:</strong> <span className="font-medium">{task.status}</span></p>
          <p><strong>Assign Date:</strong> {task.assign_date}</p>
          <p><strong>Deadline:</strong> <span className="text-red-500 font-medium">{task.deadline_date}</span></p>
          <p><strong>Role:</strong> {task.role}</p>
          <p><strong>Assigned To:</strong> <span className="text-green-600 font-semibold">{task.user_name || task.user?.user_name || "❌ Not Assigned"}</span></p>

          {task.invite_link && (
            <p>
              <strong>Invite Link:</strong>{" "}
              <a
                href={task.invite_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {task.invite_link}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSingleTask;

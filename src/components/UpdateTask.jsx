import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import instanceAxios from '../api/axiosInstance.js';

const UpdateTaskForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { id } = useParams();
    const navigate = useNavigate();

    const role = window.location.pathname.includes('manager') ? 'manager' : 'admin';

    const onSubmit = async (data) => {
        try {
            const res = await instanceAxios.put(`${role}/updatetask/${id}`, data);
            console.log(res);
            alert('✅ Task updated successfully');
            navigate(`/${role}/view-tasks`);
        } catch (error) {
            console.error(error);
            alert('❌ Failed to update task');
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 space-y-4"
        >
            <h2 className="text-2xl font-bold text-center">Update Task</h2>

            <input
                type="text"
                {...register('title')}
                placeholder="Task Title"
                className="w-full p-2 border rounded-lg"
            />
            {errors.title && <p className="text-red-500 text-sm">Title is required</p>}

            <textarea
                {...register('description')}
                placeholder="Task Description"
                className="w-full p-2 border rounded-lg"
                rows="3"
            />
            {errors.description && <p className="text-red-500 text-sm">Description is required</p>}

            <div>
                <label className="text-sm">Deadline Date</label>
                <input
                    type="date"
                    {...register('deadline_date')}
                    className="w-full p-2 border rounded-lg"
                />
            </div>

            <div>
                <label className="text-sm">Assign Date</label>
                <input
                    type="date"
                    {...register('assign_date')}
                    className="w-full p-2 border rounded-lg"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
                🔄 Update Task
            </button>
        </form>
    );
};

export default UpdateTaskForm;

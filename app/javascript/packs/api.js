import axios from 'axios';

export const listTasks = async () => {
  const res = await axios.get('/tasks.json');
  return res.data;
};

export const createTask = async task => {
  let localTask = task;

  delete localTask.id;

  const res = await axios.post('/tasks.json', localTask);
  return res.data;
};

export const updateTask = async task => {
  let taskId = task.id;
  let localTask = {
    name: task.name,
    description: task.description,
    completed: task.completed
  };

  const res = await axios.put(`/tasks/${taskId}.json`, localTask);
  return res.data;
};

export const deleteTask = async taskId => {
  await axios.delete(`/tasks/${taskId}.json`);
  console.log(`Successfully deleted task: ${taskId}`);
  return 'success';
};

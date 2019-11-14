import axios from 'axios';

// May be able to change from '.then' to async/await
// export function listTasks() {
//   return axios.get('/tasks.json').then(function(response) {
//     return response.data;
//   });
// }

const listTasks = async () => {
  const res = await axios.get('/tasks.json');
  return res.data;
};

listTasks().then(function(response) {
  console.log(response);
});

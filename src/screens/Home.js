import { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import Rows from "../components/Row.js";
import { useUser } from '../context/useUser';


const url = "http://localhost:3001"


  function Home() {

    const { user}  = useUser();
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');
 

// get all tasks
useEffect(() => {
  axios.get(url)
  .then(response => {
    setTasks(response.data);
  })
  .catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      alert(error.response.data.error ? error.response.data.error : error);
    } else if (error.request) {
      // The request was made but no response was received
      alert("No response received from the server.");
    } else {
      // Something happened in setting up the request that triggered an Error
      alert("Error: " + error.message);
    }
  });
}, []);




// add task
  const addTask = () => {
    const headers = {headers: {Authorization: user.token}};

   axios.post(url + '/create', {description: task}, headers)
  
  .then(response => {
    // setTasks([...tasks, task]);
    setTasks([...tasks, { id: response.data.id, description: task }]); 
    setTask('');
  })
  .catch((error) => {
    alert(error.response.data.error ? error.response.data.error : error);
  });
}
  // delete task
    const deleteTask = (id) => {

      const headers = {headers: {Authorization: user.token}};

      if (isNaN(id)) {
        alert("Invalid task ID");
        return;
      }
    
    axios.delete(url + '/delete/' + id, headers)
    .then( response => {
    const withoutRemoved = tasks.filter((item) => item.id !== id);
    setTasks(withoutRemoved);
    }).catch((error) => {
      alert(error.response.data.error ? error.response.data.error : error);
    });
  }

  return (
    <div id="container">
        <h3>Todos</h3>
            <form>  
                <input 
                placeholder='add new task'
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={ e => {
                if (e.key === 'Enter') {
                e.preventDefault();
                addTask();                
                }
               }}
                />
            </form>
            <ul>
              {tasks.map(item =>(
               <Rows key={item.id} item={item} deleteTask={deleteTask} /> 
              ))}
            </ul>  
    </div>
  );
}

export default Home;
import Header from './components/Header'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
import {useState, useEffect} from 'react'

const App = () => {
    const [showAddTaskForm, setShoAddTaskForm] = useState(false)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks()
            setTasks(tasksFromServer)
        }
        getTasks()
    }, [])

    const fetchTasks = async () => {
        const res = await fetch('http://localhost:5000/tasks')
        return await res.json()
    }

    const fetchTask = async (id) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}`)
        return await res.json()
    }

    const addTask = async (task) => {
        const res = await fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(task)
        })
        const data = await res.json()
        setTasks([...tasks, data])
        // const id = Math.floor(Math.random() * 10000) + 1
        // const newTask = {id, ...task}
        // setTasks([...tasks, newTask])
    }

    const deleteTask = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'DELETE'
        })
        setTasks(tasks.filter((task) => task.id !== id))
    }

    const toggleReminder = async (id) => {
        const taskToToggle = await fetchTask(id)
        const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}
        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(updatedTask)
        })

        const data = await res.json()
        setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
    }

    return (
        <BrowserRouter>
            <div className="container">
                <Header
                    onAdd={() => setShoAddTaskForm(!showAddTaskForm)}
                    showAddBtn={showAddTaskForm}
                />
                <Routes>
                    <Route path='/' exact element={
                        <>
                            {showAddTaskForm && <AddTask onAdd={addTask}/>}
                            {tasks.length > 0 ?
                                <Tasks tasks={tasks}
                                       onDelete={deleteTask}
                                       onToggle={toggleReminder}
                                /> : 'No tasks to show'}
                        </>
                    }/>
                    <Route path='/about' element={<About/>}/>
                </Routes>
                <Footer/>
            </div>
        </BrowserRouter>
    );
}
export default App;

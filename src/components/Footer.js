import {Link, Outlet} from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <p>Copyright &copy; 2022</p>
            <Link to="/about">About</Link>
            <Outlet/>
        </footer>
    )
}

export default Footer
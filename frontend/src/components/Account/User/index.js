import { useSelector } from "react-redux"
import './index.css'


export default function Profile () {
    const user = useSelector(state => state.session.user)
    const firstName = useSelector(state => state.session.user.firstName)
    console.log(user)
    return (
        <div className="profile-card">
    <h1>Your Profile:</h1>
    <div style={{"display":"flex", "flexDirection":"column"}}>
        <div>
            First Name: {firstName}
        </div>
        <div>
            Last Name: {user.lastName}
        </div>
        <div>
            Username: {user.username}
        </div>
        <div>
            Email: {user.email}
        </div>
    </div>
</div>
)
}

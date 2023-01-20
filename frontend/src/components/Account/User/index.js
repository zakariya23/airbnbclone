import { useSelector } from "react-redux"
import './index.css'


export default function Profile () {
    const user = useSelector(state => state.session.user)

    return (
        <div className="profile-card">
    <h1>Your Profile:</h1>
    <div style={{"display":"flex", "flexDirection":"column"}}>
        <div>
            Name: {user.firstName}
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

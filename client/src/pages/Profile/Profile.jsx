import "./profile.css";
import Topbar from "../../components/topbar/Topbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router"

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      //Retrieve data properly
      const res = await axios.get(`/users?username=${username}`)
      .then((res) => 
        setUser(res.data))
      .catch(err => 
        console.log(err)
      );
    }
    fetchUser();
  }, [username])

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverPicture ? PF + user.coverPicture : PF + "person/noCover.png"}
                alt=""
              />
              <img
                className="profileUserImg"
                src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"}
                alt=""
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user?.username}</h4>
                <span className="profileInfoDesc">{user?.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username}/>
            {/* Specify which Rightbar component has the prop passed into it */}
            <Rightbar user={user}/>
          </div>
        </div>
      </div>
    </>
  )
}

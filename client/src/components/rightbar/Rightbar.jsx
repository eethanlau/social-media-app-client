import "./rightbar.css"
import { Users } from "../../dummyData"
import Online from "../online/Online"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import Edit from "@mui/icons-material/Edit";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  // Destructure currentUser alias to be that of user
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser.followings.includes(currentUser.followings.includes(user?.id)));

  // useEffect(() => {
  //   setFollowed(currentUser.followings.includes(user?.id))
  // }, [currentUser, user.id])

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id)
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  },[user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put("/users/" + user._id +  "/unfollow", {userId: currentUser._id});
        dispatch({type: "UNFOLLOW", payload: user._id});
      } else {
        await axios.put("/users/" + user._id +  "/follow", {userId: currentUser._id});
        dispatch({type: "FOLLOW", payload: user._id});
      }
    } catch (err) {
      console.log(err)
    }
    setFollowed(!followed);
  }

  //Implement separate component implementations for the right bar depending on which page will be displayed for users
  const HomeRightbar = () => {
    return (
      <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Paola June</b> and <b>2 other friends</b> have a birthday today
          </span>
        </div>
        <img src="assets/ad.png" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Active Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((user) => (
            <Online key={user.id} user={user}/>
          ))}
        </ul>
      </div>
    </div>
    )
  };
  
  const ProfileRightbar = () => {
    return (
      <>
      {user.username == currentUser.username && (
        // Link this button to the edit form accordingly
        <Link to={"/profile/" + user.username + "/edit"} style={{textDecoration:"none"}}>
        <button className="rightbarFollowButton">
          Edit        <Edit/>
        </button>
        </Link>
        // Create a link to delete users as accordingly as well
      )} 
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove/> : <Add/>}
        </button>
      )}
        <h4 className="rightbarTitle">{user?.username + "'s Information"}</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user?.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user?.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">This User's Friends:</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
              <Link to={"/profile/" + friend.username} style={{ textDecoration: "none" , textAlign: "center"}}>
              <div className="rightbarFollowing">
              <img
                src={friend?.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"}
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">{friend?.username}</span>
            </div>
            </Link>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar/> : <HomeRightbar/>}
      </div>
    </div>
  )
}


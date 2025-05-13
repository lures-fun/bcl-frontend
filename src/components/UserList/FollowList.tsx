import { List } from "@chakra-ui/react"
import { UserItem } from "./FollowItem"

type Props = {
  userList: {
    id: string,
    profileIcon: string,
    userName: string,
    followed: boolean
    isOwnProfile: boolean
    onFollowUpdate?: (newState: boolean) => void
  }[]
} 

export const UserList = ({ userList  } : Props) => {
  return (
    <List spacing='10'>
      {
        userList.map((user) => (
          <UserItem 
          key={user.id}
          id={user.id}
          profileImage={user.profileIcon}
          username={user.userName}
          isFollowed={user.followed}
          onFollowUpdate={user.onFollowUpdate}
          isOwnProfile={user.isOwnProfile}
        />
        ))
      }
    </List>
  )
}
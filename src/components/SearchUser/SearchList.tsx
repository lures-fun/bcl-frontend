import { List } from '@chakra-ui/react';
import SearchUserItem from '@/components/SearchUser/SearchUserItem';

type Props = {
  searchUsers: {
    id: string;
    profileIcon: string;
    userName: string;
    firstName: string;
    lastName: string;
    followed: boolean;
  }[];
};

export const SearchUserList = ({ searchUsers }: Props) => {
  return (
    <List spacing="10">
      {searchUsers.map((user) => (
        <SearchUserItem
          key={user.userName}
          id={user.id}
          profileImage={user.profileIcon}
          userName={user.userName}
          firstName={user.firstName}
          lastName={user.lastName}
          followed={user.followed}
        />
      ))}
    </List>
  );
};

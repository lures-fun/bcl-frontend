import { Flex, Text } from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/react"

type Props = {
  profileImage: string,
  firstName: string,
  lastName: string,
  userName: string,
}
export const Profile = ({ profileImage, firstName, lastName, userName }: Props) => {
  return (
    <Flex alignItems='center'>
      <Flex flexDirection='column' textColor='white' px={{base: 0, md: 5}} pl='2' textAlign='center'>
        <Avatar
          src={profileImage}
          rounded='full'
          border='3px'
          size={{base: 'lg', sm: 'xl'}}
          name={userName}
          alignSelf='center'
          my={7}
        />
        <Text>{firstName} {lastName}</Text>
        <Text>@{userName} </Text>
      </Flex>
    </Flex>
  )
}
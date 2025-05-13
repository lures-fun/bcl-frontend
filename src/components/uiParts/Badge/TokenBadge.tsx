import { Badge } from "@chakra-ui/react";

type Props = {
  count: number
}
export const TokenBadge = ({ count }: Props) => {
  return <Badge
    ml={1}
    fontSize='2xs'
    borderRadius='full'
    background={count === 10 ? '#b9aa3f' : '#3098f2'}
    px={count === 10 ? '1px' : undefined}
    color='white'
  >
    {count}
  </Badge>;
}
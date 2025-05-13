import { Box, Divider, Text } from "@chakra-ui/react"
type ConfirmItemProps = {
  label: string
  content: string
}
export const ConfirmItem = ({ label, content }: ConfirmItemProps) => {
  return (
    <Box>
      <Text color="white" fontWeight='bold'>{label}</Text>
      <Text color="white" my='2' fontWeight='light'>{content}</Text>
      <Divider my='5' color='brand.borderGray'/>
    </Box>
  )
}
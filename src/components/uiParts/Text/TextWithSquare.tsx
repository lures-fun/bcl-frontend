import { Text, TextProps } from "@chakra-ui/react"
import { css } from "@emotion/react"
import { ReactNode } from "react"

type Props = TextProps & {
  children: ReactNode
}

export const TextWithSquare = ({ children, ...rest }: Props) => {
  return <Text css={sqrBeforeText} {...rest}>{children}</Text>
}


const sqrBeforeText = css`
  &::before {
    content: '\u25A0 ';
  }
`
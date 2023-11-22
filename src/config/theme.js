import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
    initialColorMode: "dark",
    useSystemColorMode: false,
    colors: {
        light: {},
        dark: {}
    }
})

export default theme
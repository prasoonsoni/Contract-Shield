

import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    Link,
    useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { BASE_URL } from '../config/constants'

export default function Login() {
    const navigate = useNavigate()
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const login = async () => {
        try {
            if (email === "" || password === "") {
                toast({
                    title: "Error",
                    description: "Please fill out all fields",
                    status: "error",
                    duration: 3000,
                })
                return
            }
            setLoading(true)
            const response = await fetch(`${BASE_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim(),
                }),
            })
            const data = await response.json()
            console.log(data)
            if (data.success) {
                localStorage.setItem("token", data.token)
                toast({
                    title: "Success",
                    description: "Logged in successfully",
                    status: "success",
                    duration: 3000,
                })
                navigate("/dashboard")
                // navigate("/dashboard")
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    status: "error",
                    duration: 3000,
                })
            }
            setLoading(false)
        } catch (error) {
            console.log(error.message)
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
            })
            setLoading(false)
        }
    }
    return (
        <>
            <Navbar />
            <Stack
                bgColor={"#00242c"}
                h={"90vh"}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack textAlign={'center'}>
                        <Heading fontSize={'4xl'} color={"#fff"}>Sign in to your account</Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            to enjoy all of our cool features ✌️
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        // bgColor={""}
                        bg={"rgb(39, 103, 73, 0.2)"}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel color={"#fff"}>Email address</FormLabel>
                                <Input color={"#fff"} type="email" focusBorderColor='green.400' disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel color={"#fff"}>Password</FormLabel>
                                <Input color={"#fff"} type="password" focusBorderColor='green.400' disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} />
                            </FormControl>
                            <Stack spacing={3}>
                                <Button
                                    loadingText="Logging in..."
                                    isLoading={loading}
                                    bg={'green.400'}
                                    color={'white'}
                                    onClick={login}
                                    _hover={{
                                        bg: 'green.500',
                                    }}>
                                    Sign in
                                </Button>
                                <Text align={'center'} color={"#fff"}>
                                    Not a user? <Link onClick={() => navigate("/signup")} color={'green.400'}>Sign up</Link>
                                </Text>
                            </Stack>

                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}
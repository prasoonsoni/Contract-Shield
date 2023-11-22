import {
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    Link,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { BASE_URL } from '../config/constants'
export default function SignUp() {
    const navigate = useNavigate()
    const toast = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const createAccount = async () => {
        try {
            if (firstName === "" || lastName === "" || email === "" || password === "") {
                toast({
                    title: "Error",
                    description: "Please fill out all fields",
                    status: "error",
                    duration: 3000,
                })
                return
            }
            setLoading(true)
            const response = await fetch(`${BASE_URL}/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    email: email.trim(),
                    password: password.trim(),
                }),
            })
            const data = await response.json()
            if (data.success) {
                toast({
                    title: "Success",
                    description: "Account created successfully",
                    status: "success",
                    duration: 3000,
                })
                // navigate("/login")
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
                // minH={'100vh'}
                // align={'center'}
                // justify={'center'}
                bgColor={"#00242c"}
                h={"90vh"}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'} textAlign={'center'} color={"#fff"}>
                            Sign up to your account
                        </Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            to enjoy all of our cool features ✌️
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={"rgb(39, 103, 73, 0.2)"}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <HStack>
                                <Box>
                                    <FormControl id="firstName" isRequired>
                                        <FormLabel color={"#fff"}>First Name</FormLabel>
                                        <Input color={"#fff"} type="text" disabled={loading} value={firstName} onChange={(e) => setFirstName(e.target.value)} focusBorderColor='green.400' />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl id="lastName" isRequired>
                                        <FormLabel color={"#fff"}>Last Name</FormLabel>
                                        <Input color={"#fff"} type="text" disabled={loading} value={lastName} onChange={(e) => setLastName(e.target.value)} focusBorderColor='green.400' />
                                    </FormControl>
                                </Box>
                            </HStack>
                            <FormControl id="email" isRequired>
                                <FormLabel color={"#fff"}>Email address</FormLabel>
                                <Input color={"#fff"} type="email" disabled={loading} focusBorderColor='green.400' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel color={"#fff"}>Password</FormLabel>
                                <InputGroup>
                                    <Input color={"#fff"} type={showPassword ? 'text' : 'password'} disabled={loading} focusBorderColor='green.400' value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={3} >
                                <Button
                                    onClick={createAccount}
                                    loadingText="Signing up..."
                                    isLoading={loading}
                                    bg={'green.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'green.500',
                                    }}>
                                    Sign up
                                </Button>
                                <Text align={'center'} color={"#fff"}>
                                    Already a user? <Link onClick={() => navigate("/login")} color={'green.400'}>Login</Link>
                                </Text>
                            </Stack>

                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}
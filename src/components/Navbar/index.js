import { Avatar, HStack, Image, Spacer, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import logo from "../../logos/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../config/constants'
const Navbar = () => {
    const token = localStorage.getItem("token")
    const [name, setName] = useState("")
    const navigate = useNavigate()
    const getUser = async () => {
        const response = await fetch(`${BASE_URL}/user/info`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            }
        })
        const data = await response.json()
        if (data.success) {
            setName(data.user.first_name + " " + data.user.last_name)
        }
    }
    useEffect(() => {
        if (token) {
            getUser()
        }
    })
    const logout = () => {
        setName("")
        localStorage.removeItem("token")
        navigate("/")
    }
    return (
        <>
            <HStack p={2} bgColor={"#00242c"} alignSelf={"start"} height={"10vh"} >
                <Link to={token ? "/dashboard" : "/"}>
                    <Image src={logo} h={"50px"} />
                </Link>
                <Spacer />
                <Tooltip label="Logout" hasArrow placement='left'>
                    {name && <Avatar name={name} size={"sm"} onClick={logout} _hover={{ cursor: "pointer" }} />}
                </Tooltip>
            </HStack>
        </>
    )
}

export default Navbar
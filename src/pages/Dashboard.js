import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Stack, FormControl, FormLabel, Button, Input, useToast, Text, Spacer } from '@chakra-ui/react'
import { FiPlusCircle } from "react-icons/fi";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react'
//importing pdfmake to generate our PDF file
import pdfMake from "pdfmake/build/pdfmake"
//importing the fonts whichever present inside vfs_fonts file
import pdfFonts from "pdfmake/build/vfs_fonts"
import { FiEye, FiDownload } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../config/constants';

const Dashboard = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [fileName, setFileName] = useState("")
    const [loading, setLoading] = useState(false)
    const [codes, setCodes] = useState([])
    const navigate = useNavigate()
    const toast = useToast()
    const getCodes = async () => {
        try {
            const response = await fetch(`${BASE_URL}/code/getall`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                }
            })
            const data = await response.json()
            if (data.success) {
                setCodes(data.codes)
                console.log(data.codes)
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    status: "error",
                    duration: 3000,
                })
            }
        } catch (error) {
            console.log(error.message)
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
            })
        }
    }
    const createFile = async () => {
        try {
            if (fileName === "") {
                toast({
                    title: "Error",
                    description: "File name cannot be empty",
                    status: "error",
                    duration: 3000,
                })
                return
            }
            setLoading(true)
            const response = await fetch(`${BASE_URL}/code/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    "file_name": fileName.trim()
                }),
            })
            const data = await response.json()
            console.log(data)
            if (data.success) {
                toast({
                    title: "Success",
                    description: "File created successfully",
                    status: "success",
                    duration: 3000,
                })
                navigate(`/code/${data.code._id}`)
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
    useEffect(() => {
        if (localStorage.getItem("token")) {
            getCodes()
        }
    }, [])
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent bgColor={"#00242c"}>
                    <ModalHeader color={"#fff"}>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl id="password">
                            <FormLabel color={"#fff"}>File Name</FormLabel>
                            <Input color={"#fff"} focusBorderColor='green.400' disabled={loading} value={fileName} onChange={(e) => setFileName(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            mr={3}
                            loadingText="Creating file..."
                            // isLoading={loading}
                            // leftIcon={<FiPlusCircle />}
                            bg={'green.400'}
                            color={'white'}
                            width={"fit-content"}
                            // onClick={login}
                            onClick={createFile}
                            _hover={{
                                bg: 'green.500',
                            }}>
                            Create
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Navbar />
            <Stack bgColor={"#00242c"} h={"90vh"} p={2}>
                <Button
                    // loadingText="Logging in..."
                    // isLoading={loading}
                    leftIcon={<FiPlusCircle />}
                    width={{ base: "100%", md: "fit-content" }}
                    onClick={onOpen}
                    bg={'green.400'} 
                    color={'white'}
                    _hover={{
                        bg: 'green.500',
                    }}>
                    Create New File
                </Button>
                {codes.length > 0 && <Stack spacing={2}>
                    {codes.map((code, index) => (
                        <Stack
                            key={index}
                            p={3}
                            bgColor={"rgb(39, 103, 73, 0.2)"}
                            borderRadius={"10px"}
                            direction={{ base: "column", md: "row" }}
                            justifyContent={"center"}
                            alignItems={"center"}
                        // gap={2}
                        >
                            <Text fontSize={"xl"} color={"#fff"}>{code.file_name}</Text>
                            <Spacer />
                            <Button colorScheme='gray' width={{ base: "100%", md: "fit-content" }} leftIcon={<FiEye />} onClick={() => navigate(`/code/${code._id}`)}>View Code</Button>
                            {code.analyzed && <Button colorScheme='gray' width={{ base: "100%", md: "fit-content" }} leftIcon={<FiDownload />} onClick={() => {
                                var docDefinition = {
                                    content: [
                                        { text: 'Code with error', style: 'header' },
                                        { text: code.code, },
                                        { text: 'Code without error', style: 'header' },
                                        { text: code.corrected_code, },
                                        { text: 'Vulnerabilities', style: 'header' },
                                        code.vulnerabilities.map((vul, index) => (
                                            {
                                                text: [
                                                    { text: `${index + 1}. `, bold: true },
                                                    { text: vul.vulnerability, bold: true },
                                                    {
                                                        text: `\nWhy Vulnerability exists?\n`, bold: true
                                                    },
                                                    { text: vul.explanation },
                                                    { text: `\nWhat is the solution?\n`, bold: true },
                                                    { text: vul.solution },
                                                    { text: `\nSeverity: `, bold: true },
                                                    { text: vul.rating },
                                                    { text: `\n\n` },
                                                ]
                                            }
                                        ))
                                    ],
                                    styles: {
                                        header: {
                                            fontSize: 18,
                                            bold: true,
                                            margin: [0, 20, 0, 10]
                                        },
                                        code: {
                                            fontSize: 14,
                                            margin: [0, 20, 0, 10]
                                        }
                                    }
                                }
                                pdfMake.vfs = pdfFonts.pdfMake.vfs
                                pdfMake.createPdf(docDefinition).download(`${code.file_name}.pdf`)
                            }}>Download Report</Button>}
                            <Button colorScheme='gray' width={{ base: "100%", md: "fit-content" }} leftIcon={<MdDeleteOutline />} onClick={async () => {
                                const response = await fetch(`${BASE_URL}/code/delete/${code._id}`, {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "auth-token": localStorage.getItem("token")
                                    }
                                })
                                const data = await response.json()
                                if (data.success) {
                                    toast({
                                        title: "Success",
                                        description: "File deleted successfully",
                                        status: "success",
                                        duration: 3000,
                                    })
                                    getCodes()
                                } else {
                                    toast({
                                        title: "Error",
                                        description: data.message,
                                        status: "error",
                                        duration: 3000,
                                    })
                                }
                            }}>Delete Code</Button>

                        </Stack>
                    ))}
                </Stack>
                }
                {codes.length === 0 && <Stack

                    p={3}
                    bgColor={"rgb(39, 103, 73, 0.2)"}
                    borderRadius={"10px"}
                    direction={{ base: "column", md: "row" }}
                    justifyContent={"center"}
                    alignItems={"center"}
                // gap={2}
                >
                    <Text fontSize={"xl"}>No codes available</Text></Stack>}
            </Stack >

        </>
    )
}

export default Dashboard
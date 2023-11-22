import React, { useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { solidity } from '@replit/codemirror-lang-solidity';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { Button, HStack, Stack, VStack, useColorMode, Text } from '@chakra-ui/react'
import { BsFileEarmarkCodeFill } from "react-icons/bs"
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../config/constants';
//importing pdfmake to generate our PDF file
import pdfMake from "pdfmake/build/pdfmake"
//importing the fonts whichever present inside vfs_fonts file
import pdfFonts from "pdfmake/build/vfs_fonts"
import { FiDownload } from "react-icons/fi";

const CodeEditor = () => {
    const { colorMode } = useColorMode()
    const { code_id } = useParams()
    const [code, setCode] = useState("");
    const [correctCode, setCorrectCode] = useState("")
    const [fileName, setFileName] = useState("")
    const [loading, setLoading] = useState(false)
    const [vulnerabilities, setVulnerabilities] = useState([])
    const [isAnalyzed, setIsAnalyzed] = useState(false)
    const onChange = React.useCallback((val, viewUpdate) => {
        console.log('val:', val);
        setCode(val);
    }, []);
    const getCode = async () => {
        try {
            const response = await fetch(`${BASE_URL}/code/get/${code_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                }
            })
            const data = await response.json()
            if (data.success) {
                setCode(data.code.code)
                setCorrectCode(data.code.corrected_code)
                setVulnerabilities(data.code.vulnerabilities)
                setIsAnalyzed(data.code.analyzed)
                setFileName(data.code.file_name)
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getCode()
    }, [])
    const isMobile = window.innerWidth < 768;
    const analyzeCode = async () => {
        setLoading(true)
        try {
            const response = await axios.post(process.env.REACT_APP_CHAT_GPT_BASE_URL, {
                model: "gpt-3.5-turbo",
                temperature: 0,
                messages: [
                    {
                        role: "system",
                        content: `You are an assistant that only speaks JSON. Do not write normal text. 

                    Find the possible vulnerabilities in the code from the list given, give only the relevant vulnerability -> [
                        "Reentrancy Attacks",
                        "Integer Overflows/Underflows",
                        "Unchecked External Calls",
                        "Access Control Issues",
                        "Uninitialized Storage Variables",
                        "Gas Limitation",
                        "Timestamp Dependence",
                        "External Influences",
                        "Denial of Service (DoS)",
                        "Cross-Site Scripting (XSS) Attacks",
                        "Dependency on External Contracts",
                        "Suicidal Contracts",
                        "Delegate call Attacks",
                        "Unchecked Return Values",
                        "Uncontrolled Ether Flows",
                        "Insecure Random Number Generation",
                        "Gas Griefing"
                    ]  also provide the solution on how to solve the vulnerabilities. 
                    Also give the rating as low, medium or high for each one of the vulnerability.
                    Give explanation why vulnerability is present and why you gave the rating.
                    After finding the vulnerabilities and giving the rating and explanation, give the corrected code with proper comments inside the code, where we have solved the vulnerabilities.
                    Give the result in following JSON format - 
                        {
                            "corrected_code": "Give the code with proper comments inside the code, where we have solved the vulnerabilities",
                            vulnerabilities:[
                                {
                                    "vulnerability": "",
                                    "explanation":"",
                                    "rating": "",
                                    "solution": ""
                                }
                            
                            ]
                        }`
                    },
                    {
                        role: "user",
                        content: code
                    },
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_CHAT_GPT_API_KEY}`,
                    "Content-Type": "application/json"
                }
            });
            const item = response?.data?.choices[0]?.message;
            const content = item?.content;
            console.log(content)
            const res = JSON.parse(content)
            setCorrectCode(res.corrected_code)
            setVulnerabilities(res.vulnerabilities)

            const response2 = await fetch(`${BASE_URL}/code/update/${code_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        "code": code,
                        "corrected_code": res.corrected_code,
                        "vulnerabilities": res.vulnerabilities
                    }),
                })
            const data = await response2.json()
            if (data.success) {
                console.log("Code updated successfully")
                setIsAnalyzed(true)
            } else {
                console.log("Error in updating code")
            }
        } catch (error) {
            console.log(error.message)
        }
        setLoading(false)
    }
    return (
        <Stack p={5} alignItems={"center"} bgColor={"#00242c"} >
            <Stack justifyContent={"center"} alignItems={"center"} direction={{ base: "column", md: "row" }}>
                <VStack alignItems={"start"}>
                    <Text>Code with vulnerabilities</Text>
                    <CodeMirror
                        theme={githubDark}
                        value={code}
                        height="70vh"
                        width={isMobile ? "90vw" : "45vw"}
                        extensions={[solidity]}
                        editable={!isAnalyzed}
                        placeholder={"Enter your smart contract here..."}
                        lineNumbers={true}
                        foldGutter={true}
                        bracketMatching={true}
                        highlightActiveLineGutter={true}
                        highlightSpecialChars={true}
                        autocompletion={true}
                        onChange={onChange}
                    />;
                </VStack>
                <VStack alignItems={"start"}>
                    <Text>Code without vulnerabilities</Text>
                    <CodeMirror
                        theme={githubDark}
                        value={correctCode}
                        height="70vh"
                        width={isMobile ? "90vw" : "45vw"}
                        extensions={[solidity]}
                        editable={!isAnalyzed}
                        placeholder={"Corrected Code will appear here"}
                        lineNumbers={true}
                        foldGutter={true}
                        bracketMatching={true}
                        highlightActiveLineGutter={true}
                        highlightSpecialChars={true}
                        autocompletion={true}
                    />;
                </VStack>
            </Stack>

            {!isAnalyzed && <Button
                leftIcon={<BsFileEarmarkCodeFill />}
                bg={'green.400'}
                color={'white'}
                _hover={{
                    bg: 'green.500',
                }}
                loadingText="Analyzing..."
                isLoading={loading}
                onClick={analyzeCode}
                width={"fit-content"}>
                Analyze Code
            </Button>}
            {vulnerabilities && vulnerabilities.length > 0 && <VStack>
                <Text alignSelf={"start"} fontWeight={"bold"} fontSize={"1.5rem"} color={"#fff"}>Vulnerabilities</Text>
                <VStack alignItems={"start"} spacing={2}>
                    {vulnerabilities.map((vul, index) => (
                        <VStack width={"full"} p={3} borderRadius={"20px"} alignItems={"start"} spacing={2} key={index} bgColor={vul.rating === "high" ? "rgb(255,0,0,0.2)" : vul.rating === "medium" ? "rgb(255,165,0,0.2)" : "rgb(0,255,0,0.2)"}>
                            <Text fontWeight={"bold"} fontSize={"1.3rem"} color={"#fff"}>{vul.vulnerability}</Text>
                            <Text fontWeight={"medium"} fontSize={"1.1rem"} color={"#fff"}>Why Vulnerability exists?</Text>
                            <Text fontSize={"1rem"} color={"#fff"}>{vul.explanation}</Text>
                            {/* <Text>Rating: {vul.rating}</Text> */}
                            <Text fontWeight={"medium"} fontSize={"1.1rem"} color={"#fff"}>What is the solution?</Text>
                            <Text fontSize={"1rem"} color={"#fff"}>{vul.solution}</Text>
                        </VStack>
                    ))}
                </VStack>
            </VStack>}
            {isAnalyzed && <Button colorScheme='gray' width={{ base: "100%", md: "fit-content" }} leftIcon={<FiDownload />} onClick={() => {
                var docDefinition = {
                    content: [
                        { text: 'Code with error', style: 'header' },
                        { text: code, },
                        { text: 'Code without error', style: 'header' },
                        { text: correctCode, },
                        { text: 'Vulnerabilities', style: 'header' },
                        vulnerabilities.map((vul, index) => (
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
                pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`)
            }}>Download Report</Button>}
        </Stack>
    )
}

export default CodeEditor
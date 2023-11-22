import { Stack } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import CodeEditor from "../components/CodeEditor";

function App() {
    return (
        <>
            <Navbar />
            <Stack spacing={0}>
                <CodeEditor />
            </Stack>
        </>
    );
}

export default App;

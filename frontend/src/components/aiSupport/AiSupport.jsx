
import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useEffect } from "react";
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"

const AiSupport = (props) => {

    const sidebarRef = useRef(null);
    const [sidebarWidth, setSidebarWidth] = useState(300);
    const [prompt, setprompt] = useState("")
    const [output, setoutput] = useState("")
    const [IsDragging, setIsDragging] = useState(false)
    const [isLoading, setisLoading] = useState(false)

    // Function to close the sidebar
    const closeSidebar = () => {
        setprompt("")
        setoutput("")
        document.querySelector("#AiSupport").querySelector("textarea").value = ""
        gsap.to(sidebarRef.current, { x: "100%", duration: 0.5, ease: "power2.out" });
    };

    // Handle mouse down on the resize handle
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // Handle mouse move to resize the sidebar
    const handleMouseMove = (e) => {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 200 && newWidth <= 600) {
            setSidebarWidth(newWidth);
        }
    };

    // Handle mouse up to stop resizing
    const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleGenerateCode = async () => {
        try {
            setisLoading(true)
            const response = await fetch(`${import.meta.env.VITE_REACT_FLASK_URL}/generate_code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Set content type to JSON
                },
                body: JSON.stringify({ code_prompt: `${prompt} and the language is ${props.language}` }), // JSON payload
            });
            setisLoading(false)
            if (!response.ok) {
                console.log("error")
                // throw new Error(`HTTP error! Status: ${response.status}`);
                toast.error('HTTP error! Status: ${response.status}', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

            const data = await response.json();
            if (data.error) {
                console.log(data.error)
                toast.error('Some error occure please try again', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                // formatCodeWithLineBreaks(data.generated_code)
                const str = formatCodeWithLineBreaks(data.generated_code)
                setoutput(str);
            }
        } catch (err) {
            setisLoading(false)
            toast.error(err.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            console.log(err.message);
        }
    };

    const formatCodeWithLineBreaks = (str) => {
        return str.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (

        <div
            ref={sidebarRef}
            style={{ width: `${sidebarWidth}px` }}
            id="AiSupport"
            className=" rounded-xl z-40 fixed top-[15vh] right-0 min-h-[50vh] max-h-[70vh] overflow-x-visible overflow-y-auto bg-gray-900 shadow-lg transform translate-x-full"
        >
            <ToastContainer />
            <div className=" relative w-full h-full py-15 ">

                {/* Resize handle */}
                <div
                    onMouseDown={handleMouseDown}
                    className="absolute top-0 me-2 -left-[8px] w-3 h-full cursor-ew-resize bg-gray-700 hover:bg-blue-500"
                />
                {/* Close button */}
                <button button
                    onClick={closeSidebar}
                    className=" cursor-pointer absolute font-light m-3 top-0 right-2 w-12 h-12 text-white text-4xl pb-2 rounded-full bg-slate-800 hover:bg-slate-600"
                >
                    x
                </button >

                {/* Text area */}
                <div className="p-4" >
                    <textarea
                        className="w-full h-32 p-2 bg-gray-800 text-white rounded min-h-20"
                        placeholder="Type something..."
                        value={prompt}
                        onChange={(e) => {
                            setprompt(e.target.value)
                        }}
                    />
                </div >

                {/* Send button */}
                <div className="p-4" >
                    <button onClick={() => {
                        if (prompt && prompt !== "") handleGenerateCode()
                    }}
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                        {isLoading ? "Fetching" : "Ask AI"}
                    </button>
                </div >

                {/* output from ai  */}
                {output && output !== "" && <div className="p-2 text-white rounded-2xl border-2 border-slate-700 mx-2">
                    {output}
                </div>}

            </div>
        </div >

    );
};

export default AiSupport;
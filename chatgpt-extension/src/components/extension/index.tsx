import "./index.css"
import {Switch} from "@mui/material"
import { getValue } from "@testing-library/user-event/dist/utils"
import { get } from "http"
import {useState,useEffect} from "react"
import { useSelector } from "react-redux"

const Extension = ()=>{
    
    const [activeTabId, setActiveTabId] = useState<number>()
    const activeTab = useSelector((state:any)=>state.activeTab)
    const isEnabled = localStorage.getItem("isEnabled")
    const statusValue = isEnabled==="true" ? "Disable" : "Enable"
    const [label,setLabel] = useState<any>(statusValue)

    useEffect(()=>{
        activeTab.then((data:any)=>setActiveTabId(data.id))
    })

    const onSwitchClick = (event:any)=>{
        if(event.target.value === "Enable"){
            localStorage.setItem('isEnabled',"true")
            if(activeTabId){
                chrome.tabs.sendMessage(activeTabId,{
                    type: "Enable",
                    isEnabled: true
                })
            }
            
            setLabel("Disable")
        }
        else{
            localStorage.setItem('isEnabled',"false")
            if(activeTabId){
                chrome.tabs.sendMessage(activeTabId,{
                    type: "Disable",
                    isEnabled: false
                })
            }
            setLabel("Enable")
        }
    }
    const getSwitchStausValue = isEnabled === "true" ? true : false

    return(
        <div>
            <div className="extension-content-box">
                <img src="../../assets/chatgpt.png" className="chatgpt-extension-icon" alt="chatgpt-extension-icon"/>
                <p className="description">ChatGPT is an artificial intelligence chatbot that uses natural language processing to create humanlike conversational dialogue developed by OpenAI</p>
            </div>
            <div className="enable-box">
                <span className="enable-text">{label}</span>
                <Switch
                className="switch"
                value={label}
                defaultChecked={getSwitchStausValue}
                sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                    color: "#199d71",
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor:"#199d71",
                },
                }} 
                onClick={onSwitchClick}
                />
            </div>
        </div>
    )
}

export default Extension
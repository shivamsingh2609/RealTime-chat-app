import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { animationDefaultOption, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES, HOST,SEARCH_CONTACTS_ROUTES } from "@/utils/constant";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";
  
const CreateChannel = () => {
    const {setselectedChatType,setselectedChatData,addChannel} = useAppStore()
    const [newChannelModal,setNewChannelModal] = useState(false);
    const [searchedContacts, setsearchedContacts] = useState([]);
    const [allContacts,setAllContacts] = useState([]);
    const [selectedContacts , setSelectedContacts] = useState([])
    const [channelName , setChannelName] = useState("")


    useEffect(()=>{
        const getData = async()=>{
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES,{
                withCredentials:true ,
            })
            setAllContacts(response.data.contacts)
        }
        getData();
    },[])
    const CreateChannel = async () =>{
        try {
            if(channelName.length>0 && selectedContacts.length>0){
                const response = await apiClient.post(CREATE_CHANNEL_ROUTE,{
                    name: channelName,
                    members: selectedContacts.map((contact)=> contact.value),
                },
                {
                    withCredentials:true
                }

                )
                if(response.status===201){
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModal(false);
                    addChannel(response.data.channel);
                }

            }
            
        } catch (error) {
            
        }
    }
    
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                        className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                        onClick={()=> setNewChannelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent
                    className = "bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        create New Channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
            
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel </DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="">
                        <Input placeholder = "Channel Name" className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                        onChange = {(e)=> setChannelName(e.target.value)}
                        value = {channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts} // Ensure this is a properly formatted array
                            placeholder="Search Contacts"
                            value={selectedContacts} // Ensure selectedContacts is a valid state
                            onChange={setSelectedContacts} // Ensure setSelectedContacts correctly updates the state
                            emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600">No results found</p>
                            }
                        />
                    </div>

                     <div className="">
                        <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" 
                        onClick= {CreateChannel}>Create channel</Button>
                    </div>
                    
                </DialogContent>
            </Dialog>

        </>
    );
}

export default CreateChannel;

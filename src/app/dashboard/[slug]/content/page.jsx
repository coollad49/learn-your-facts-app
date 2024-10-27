'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import { TracingBeam } from "@/components/ui/tracing-beam";
import {useParams} from "next/navigation"
import { fetchData, fetchImg } from "@/app/fetch/model";
import Loader from "@/components/loader";
import FunFactDisplay from "@/components/funFact"

const Content = () => {
    const [blogData, setBlogData] = useState({
        "title": "",
            "content": {
            "introduction": "",
            "explanation": "",
            "fun_facts": "",
            "conclusion": ""
            },
        "image_search_query": ""
    });
    const [imgUrl, setImgUrl] = useState("");
    const {slug} = useParams();

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const title = localStorage.getItem("title");
        const blog = async () => {
            try {
                console.log("fetching blog data");
                
                // Fetch the blog data
                let Data;
                if(title){
                    Data = await fetchData(slug, title);
                }
                else{
                    Data = await fetchData(slug);
                }
                console.log(Data);
    
                // Ensure blog data is valid before continuing
                if (Data && Data.image_search_query) {
                    // Update blogData state
                    setBlogData(Data);
                    
                    // Fetch image based on the image_search_query
                    const img = await fetchImg(Data.image_search_query);
    
                    // Uncomment this to set the image URL
                    setImgUrl(img.photos[0].src.original);
                    console.log(imgUrl)
                    setLoading(false);
                }
    
                
            } catch (error) {
                console.error("Error fetching blog data:", error);
                blog()
            }
        };
    
        blog();
    }, [imgUrl, slug]);

    const renderFunFacts = (fun_facts) => {    
        // Check if fun_facts is an array or a string
        if (Array.isArray(fun_facts)) {
            // If it's an array, map over the array to render each fact
            return (
                <>
                    {fun_facts.map((fact, index) => (
                        <li key={index} className="text-lg  p-4 rounded border">
                            {fact}
                        </li>
                    ))}
                </>
            );
        } else if (typeof fun_facts === "string") {
            // If it's a string, split it by bullet points (or other separators) and render it
            const factsArray = fun_facts.split("•").filter(fact => fact.trim() !== "");
            return (
                <ul>
                    {factsArray.map((fact, index) => (
                        <li key={index} className="text-lg  p-4 rounded border">
                            {fact}
                        </li>
                    ))}
                </ul>
            );
        } else if (typeof fun_facts === "object") {
            // If it's an object (key-value pairs), loop through the object and render it
            return (
                <ul>
                    {Object.entries(fun_facts).map(([key, value], index) => (
                        <li key={index} className="text-lg">
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
            );
        } else {
            return <p>No fun facts available</p>;
        }
    };
    
    
    
    if(loading){
        return(
            <div className="h-screen flex justify-center items-center">
                <Loader/>
            </div>
        )
    }
    return (
        <TracingBeam className="px-6 relative  text-black">
            <div className="max-w-2xl mx-auto antialiased py-8 relative  flex flex-col gap-5">
                <h1 className="text-3xl font-bold text-blue-500">{blogData.title}</h1>
                <a className="text-sm " href="https://www.pexels.com">Photos provided by Pexels</a>
                <Image alt={''} src={imgUrl} width={800} height={500} className="rounded-lg"/>
                <div className="flex flex-col gap-4 ">
                    <FunFactDisplay fact={blogData.content.introduction} />
                    <div>
                        <h3 className="capitalize text-center font-bold text-xl text-slate-900">{`Think you know this 🤓?`}</h3>
                        <p className="text-lg tex p-4 rounded ">{blogData.content.explanation}</p>
                    </div>
                    {renderFunFacts(blogData.content.fun_facts)}
                    <p className="text-lg  p-4 rounded ">{blogData.content.conclusion}</p>
                </div>

            </div>
        </TracingBeam>
    ); 
    
}
 

// const blogData = {
//     "title": "Understanding Democracy: A Fun and Educational Journey for Kids",
//     "content": {
//         "introduction": "Did you know that the word democracy comes from the Greek words 'demos' and 'kratos', which mean 'people' and 'power'? That's right! Today, we are going on an exciting journey to understand what democracy is, how it works, and why it matters in our lives!",
//         "explanation": "Democracy is a form of government where everyone has the right to participate in decision-making. This system is based on the belief that every person's voice and opinion matter, regardless of their background. In a democratic country, the people elect their leaders and representatives. These leaders make laws and decisions on behalf of the people. It's like choosing a class president in school! If the class president makes a decision that's not good, you can elect a new president in the next election. In a democratic country, elections happen regularly so that the leaders stay focused on serving the best interests of the people.",
//         "fun_facts": [
//             "Even though democracy sounds like a great idea, not all countries in the world practice it. Some countries are ruled by a single person or a small group of people, and those countries are not democracies.",
//             "The very first recorded democracy was in ancient Athens, in Greece, over 2,500 years ago! They had a system called 'direct democracy', where all citizens, which was around 20% of the population back then, could vote on every decision! Today, most democracies are 'representative democracies', where citizens elect representatives to vote on their behalf.",
//             "Did you know that voting isn't just for choosing leaders and making laws? People also vote on other important things like what their schools should be like, how their local parks should be designed, and many more."
//         ],
//         "conclusion": "In conclusion, democracy is a powerful tool that gives everyone an equal voice. It's like a team game, where everyone has a chance to be heard and make a difference. As a future citizen, remember that democracy works best when you participate by learning from the news, discussing your ideas with others, and voting when it's your turn! What an awesome power every citizen in a democracy holds! Keep exploring and learning more about other exciting aspects of democracy!"
//     },
//     "image_search_query": "Pexels democracy education"
// }
export default Content;
import React, { useState } from 'react';
import sparkleGif from '../assets/images/sparkle.gif';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import DrinkPage from './DrinkPage';

const GeneratingDrink: React.FC = () => {
  const [showDrink, setShowDrink] = useState(false);
  const [drinkRecomendation, setDrinkRecomendation] = useState('');

  // Initialize the Bedrock Agent Runtime client
  const client = new BedrockAgentRuntimeClient({ 
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
    }
  });

  // Create a state variable for the session ID
    const userSessionId = useState<string>(() => {
        // Try to get existing session ID from localStorage
        const savedSessionId = localStorage.getItem('chatSessionId');
        if (savedSessionId) {
            return savedSessionId;
        }
        // If no existing session, create a new one
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('chatSessionId', newSessionId);
        return newSessionId;
        });
      
  const callIntroAgent = async (userMessage: string) => {
  
    return await invokeAgent(userMessage, userSessionId[0],  import.meta.env.VITE_BEDROCK_AGENT_ID, import.meta.env.VITE_BEDROCK_AGENT_ALIAS_ID);
  }
  
  const callDrinkAgent = async (userMessage: string) => {
  
    return await invokeAgent(userMessage, `${Date.now()}`, import.meta.env.VITE_BEDROCK_DRINK_AGENT_ID, import.meta.env.VITE_BEDROCK_DRINK_ALIAS_ID);
  }
  
  const invokeAgent = async (userMessage: string, sessionId: string, agentId: string, agentAliasId: string) => {
    try {
        const command = new InvokeAgentCommand({
        agentId: agentId,
        agentAliasId: agentAliasId,
        sessionId: sessionId,
        inputText: userMessage
        });

        const response = await client.send(command);
        if (response.completion) {
        let fullResponse = '';
        
        for await (const chunk of response.completion) {
            if (chunk.chunk?.bytes) {
            fullResponse += new TextDecoder().decode(chunk.chunk.bytes);
            }
        }
        return fullResponse;
        }
        
        return "I'm sorry, I couldn't process that request.";
    } catch (error) {
        console.error('Error invoking Bedrock agent:', error);
        return "I encountered an error processing your request.";
    }
  };
  
   // Function to call Amazon Bedrock Runtime to generate an image from a prompt
  async function generateImageWithBedrock(prompt: string): Promise<string> {
    // Import AWS SDK
  
    // Initialize Bedrock client
    const client = new BedrockRuntimeClient({ 
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
      }
    });
  
    try {
      // Prepare request body for Stable Diffusion model
      const body = {
        prompt: prompt,
        negative_prompt: 'no text, no letters, no numbers, no words, no watermark, no signature, no captions, no subtitles, no signs, no billboards, no graffiti, no complex background, no detailed background, no distracting background, blurred background, out of focus background',
        mode: "text-to-image",
      };
  
      // Create command input
      const input = {
        modelId: "stability.stable-image-ultra-v1:0",
        contentType: "application/json",
        body: JSON.stringify(body)
      };
  
      // Invoke model
      const command = new InvokeModelCommand(input);
      const response = await client.send(command);
  
      // Parse response and get base64 image
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      console.log("Image Response",responseBody);
      const base64Image = responseBody.images[0];
  
      return `data:image/png;base64,${base64Image}`;
  
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }   
  
  React.useEffect(() => {
    const fetchSummary = async () => {
      const summary = await callIntroAgent("Summarise the drink using key words, less than 100 words \"GiveMeDrink\". Respond with no drink name.");
      const drink = await callDrinkAgent(summary);
      const drinkImage = await generateImageWithBedrock(drink);
      setDrinkRecomendation(JSON.stringify({
        ...JSON.parse(drink),
        image: drinkImage
      }));
      setShowDrink(true);
    };
    if (!showDrink) {
      fetchSummary();
    }
  }, [callDrinkAgent, callIntroAgent]);
  
  if (showDrink) {
      return (
          <DrinkPage drink={drinkRecomendation}/>
      );
    } else {
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl h-[calc(100vh-4rem)]">
            <div className="flex flex-col h-full">
              {/* Header */}  
              {<div
                  className="flex self-stretch justify-start items-center flex-row gap-2 py-2 px-[24px]">
                  <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                      d="M12.75 7.50003V11.5753L16.1363 13.6069C16.3068 13.7093 16.4297 13.8753 16.4779 14.0684C16.5261 14.2614 16.4956 14.4657 16.3931 14.6363C16.2907 14.8068 16.1247 14.9297 15.9316 14.9779C15.7386 15.0261 15.5343 14.9956 15.3638 14.8932L11.6138 12.6432C11.5028 12.5765 11.4109 12.4822 11.3472 12.3695C11.2834 12.2568 11.25 12.1295 11.25 12V7.50003C11.25 7.30112 11.329 7.11035 11.4697 6.9697C11.6103 6.82905 11.8011 6.75003 12 6.75003C12.1989 6.75003 12.3897 6.82905 12.5303 6.9697C12.671 7.11035 12.75 7.30112 12.75 7.50003ZM12 3.00003C10.8169 2.99708 9.64491 3.22881 8.55193 3.6818C7.45895 4.1348 6.46667 4.80006 5.6325 5.63909C4.95094 6.32909 4.34531 6.99284 3.75 7.68753V6.00003C3.75 5.80112 3.67098 5.61035 3.53033 5.4697C3.38968 5.32905 3.19891 5.25003 3 5.25003C2.80109 5.25003 2.61032 5.32905 2.46967 5.4697C2.32902 5.61035 2.25 5.80112 2.25 6.00003V9.75003C2.25 9.94894 2.32902 10.1397 2.46967 10.2804C2.61032 10.421 2.80109 10.5 3 10.5H6.75C6.94891 10.5 7.13968 10.421 7.28033 10.2804C7.42098 10.1397 7.5 9.94894 7.5 9.75003C7.5 9.55112 7.42098 9.36035 7.28033 9.2197C7.13968 9.07905 6.94891 9.00003 6.75 9.00003H4.59375C5.26406 8.21065 5.93156 7.46722 6.69281 6.69659C7.73518 5.65423 9.0616 4.94216 10.5063 4.64935C11.9511 4.35654 13.4501 4.49598 14.816 5.05023C16.182 5.60449 17.3543 6.54899 18.1866 7.76572C19.0188 8.98245 19.474 10.4175 19.4953 11.8914C19.5166 13.3654 19.1031 14.813 18.3064 16.0532C17.5098 17.2935 16.3652 18.2716 15.0159 18.8651C13.6665 19.4586 12.1722 19.6414 10.7196 19.3905C9.26698 19.1396 7.92052 18.4662 6.84844 17.4544C6.77679 17.3867 6.6925 17.3338 6.60039 17.2986C6.50828 17.2635 6.41015 17.2468 6.3116 17.2496C6.21305 17.2524 6.11602 17.2746 6.02604 17.3149C5.93606 17.3551 5.8549 17.4128 5.78719 17.4844C5.71947 17.5561 5.66654 17.6403 5.6314 17.7325C5.59626 17.8246 5.57961 17.9227 5.5824 18.0212C5.58518 18.1198 5.60735 18.2168 5.64764 18.3068C5.68792 18.3968 5.74554 18.4779 5.81719 18.5457C6.88542 19.5537 8.18414 20.285 9.6 20.6757C11.0159 21.0665 12.5058 21.1047 13.9399 20.7872C15.3739 20.4696 16.7085 19.806 17.827 18.854C18.9456 17.9021 19.8142 16.6909 20.357 15.3261C20.8998 13.9613 21.1003 12.4844 20.9411 11.0243C20.7818 9.56414 20.2677 8.16517 19.4434 6.94947C18.6192 5.73376 17.5099 4.73825 16.2125 4.04982C14.915 3.3614 13.4688 3.00098 12 3.00003Z"
                      fill="black" />
                  </svg>
                  <p
                      className="flex-1 text-[#000000] text-xl font-['Inter'] text-center font-bold">
                      AI Made Me Drink It!
                  </p>
                  <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                      d="M9.75 20.25C9.75 20.5467 9.66203 20.8367 9.4972 21.0834C9.33238 21.33 9.09811 21.5223 8.82403 21.6358C8.54994 21.7494 8.24834 21.7791 7.95736 21.7212C7.66639 21.6633 7.39912 21.5204 7.18934 21.3107C6.97956 21.1009 6.8367 20.8336 6.77882 20.5426C6.72094 20.2517 6.75065 19.9501 6.86418 19.676C6.97771 19.4019 7.16997 19.1676 7.41665 19.0028C7.66332 18.838 7.95333 18.75 8.25 18.75C8.64782 18.75 9.02936 18.908 9.31066 19.1893C9.59196 19.4706 9.75 19.8522 9.75 20.25ZM18 18.75C17.7033 18.75 17.4133 18.838 17.1666 19.0028C16.92 19.1676 16.7277 19.4019 16.6142 19.676C16.5006 19.9501 16.4709 20.2517 16.5288 20.5426C16.5867 20.8336 16.7296 21.1009 16.9393 21.3107C17.1491 21.5204 17.4164 21.6633 17.7074 21.7212C17.9983 21.7791 18.2999 21.7494 18.574 21.6358C18.8481 21.5223 19.0824 21.33 19.2472 21.0834C19.412 20.8367 19.5 20.5467 19.5 20.25C19.5 19.8522 19.342 19.4706 19.0607 19.1893C18.7794 18.908 18.3978 18.75 18 18.75ZM22.4728 6.95062L20.0691 15.6019C19.9369 16.0745 19.6542 16.4911 19.2639 16.7885C18.8736 17.0859 18.397 17.2479 17.9062 17.25H8.64C8.14784 17.2498 7.66926 17.0886 7.27725 16.791C6.88523 16.4935 6.6013 16.0758 6.46875 15.6019L3.18 3.75H1.5C1.30109 3.75 1.11032 3.67098 0.96967 3.53033C0.829018 3.38968 0.75 3.19891 0.75 3C0.75 2.80109 0.829018 2.61032 0.96967 2.46967C1.11032 2.32902 1.30109 2.25 1.5 2.25H3.75C3.91397 2.24997 4.07343 2.30367 4.20398 2.40289C4.33452 2.50211 4.42895 2.64138 4.47281 2.79938L5.36156 6H21.75C21.8656 5.99998 21.9797 6.02669 22.0833 6.07805C22.1869 6.1294 22.2772 6.20401 22.3472 6.29605C22.4171 6.38809 22.4649 6.49506 22.4867 6.60861C22.5085 6.72216 22.5037 6.83922 22.4728 6.95062ZM20.7628 7.5H5.77875L7.91719 15.2006C7.96105 15.3586 8.05548 15.4979 8.18602 15.5971C8.31657 15.6963 8.47603 15.75 8.64 15.75H17.9062C18.0702 15.75 18.2297 15.6963 18.3602 15.5971C18.4908 15.4979 18.5852 15.3586 18.6291 15.2006L20.7628 7.5Z"
                      fill="black" />
                  </svg>
                  </div>}
                    {
                        <div className="flex justify-start items-center p-10 flex-col gap-[19px]">
                            <img
                                src={sparkleGif}
                                className="w-[100px] h-[104px]" />
                            <p
                                className="self-stretch text-[#000000] text-2xl font-['Inter'] text-center font-bold">
                                Generating drink...
                            </p>
                        </div>
                    }
            
            </div>
        </div>
      </div>
    </div>
    );
    }
};

export default GeneratingDrink;
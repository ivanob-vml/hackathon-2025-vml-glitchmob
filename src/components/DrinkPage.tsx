import React, { useState, useEffect } from 'react';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

interface DrinkPageProps {
  drink: string;
}

const DrinkPage: React.FC<DrinkPageProps> = ({ 
    drink
})=> {
    const [imageSrc, setImageSrc] = useState<string>('');
    const drinkJson = JSON.parse(drink);

    useEffect(() => {
        
        generateImageWithBedrock(drink).then((img) => {
            console.log(img)
            setImageSrc(img)
        }).catch(console.error);
        
    }, [drink]);
    console.log(drinkJson);
    console.log(imageSrc);
      
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
                    <div
                        className="flex justify-start items-center flex-col gap-3 pt-[24px] relative">
                        <div
                        className="flex justify-start items-start flex-col bg-[#80506B] rounded-2xl shadow-[_0px_8px_16px_0px_rgba(0,0,0,0.12)] w-[327px] h-[600px]">
                        <div
                          className="flex justify-start items-center flex-row gap-2.5 p-1 w-[326px] h-[335px] relative"
                          style={{width: '326px'}}>
                          <img
                            src={imageSrc}
                            style={{ width: '318px'}} />
                          <div
                            className="absolute"
                            style={{right: '12px', width: '24px', top: '11px', height: '24px'}}>
                            <svg
                              width="24"
                              height="27"
                              viewBox="0 0 24 27"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_45_2113)" filter="url(#filter0_d_45_2113)">
                                <g filter="url(#filter1_d_45_2113)">
                                  <path
                                    d="M17.25 3H6.75C6.35218 3 5.97064 3.15804 5.68934 3.43934C5.40804 3.72064 5.25 4.10218 5.25 4.5V21C5.25007 21.1338 5.28595 21.2652 5.35393 21.3805C5.42191 21.4958 5.5195 21.5908 5.63659 21.6557C5.75367 21.7206 5.88598 21.7529 6.01978 21.7494C6.15358 21.7458 6.284 21.7066 6.3975 21.6356L12 18.1341L17.6034 21.6356C17.7169 21.7063 17.8472 21.7454 17.9809 21.7488C18.1146 21.7522 18.2467 21.7198 18.3636 21.655C18.4806 21.5902 18.5781 21.4953 18.646 21.3801C18.7139 21.2649 18.7498 21.1337 18.75 21V4.5C18.75 4.10218 18.592 3.72064 18.3107 3.43934C18.0294 3.15804 17.6478 3 17.25 3ZM17.25 19.6472L12.3966 16.6144C12.2774 16.5399 12.1396 16.5004 11.9991 16.5004C11.8585 16.5004 11.7208 16.5399 11.6016 16.6144L6.75 19.6472V4.5H17.25V19.6472Z"
                                    fill="white" />
                                </g>
                              </g>
                              <defs>
                                <filter
                                  id="filter0_d_45_2113"
                                  x="-4"
                                  y="-3"
                                  width="32"
                                  height="32"
                                  filterUnits="userSpaceOnUse"
                                  color-interpolation-filters="sRGB">
                                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                  <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha" />
                                  <feOffset dy="1" />
                                  <feGaussianBlur stdDeviation="2" />
                                  <feComposite in2="hardAlpha" operator="out" />
                                  <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                  <feBlend
                                    mode="normal"
                                    in2="BackgroundImageFix"
                                    result="effect1_dropShadow_45_2113" />
                                  <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect1_dropShadow_45_2113"
                                    result="shape" />
                                </filter>
                                <filter
                                  id="filter1_d_45_2113"
                                  x="1.25"
                                  y="1"
                                  width="21.5"
                                  height="26.7496"
                                  filterUnits="userSpaceOnUse"
                                  color-interpolation-filters="sRGB">
                                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                  <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha" />
                                  <feOffset dy="2" />
                                  <feGaussianBlur stdDeviation="2" />
                                  <feComposite in2="hardAlpha" operator="out" />
                                  <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                  <feBlend
                                    mode="normal"
                                    in2="BackgroundImageFix"
                                    result="effect1_dropShadow_45_2113" />
                                  <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect1_dropShadow_45_2113"
                                    result="shape" />
                                </filter>
                                <clipPath id="clip0_45_2113">
                                  <rect width="24" height="24" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <div
                          className="flex self-stretch flex-1 justify-between items-end flex-col gap-8 pt-[20px]">
                          <div
                            className="flex self-stretch flex-1 justify-start items-start flex-col gap-3 pt-[20px] pl-[24px]">
                            <div
                              className="flex self-stretch flex-1 justify-start items-start flex-col gap-3 pr-[24px]">
                              <div
                                className="flex self-stretch justify-start items-start flex-col gap-2">
                                <p
                                  className="self-stretch text-[#FFFFFF] text-xl font-['TCCC-UnityText'] font-bold">
                                  {drinkJson.name}
                                </p>
                              </div>


{drinkJson.ingredients}
                            </div>
                            <div
                              className="flex self-stretch justify-start items-start flex-row gap-2.5">
                              <div className="flex flex-1 justify-start items-start flex-row gap-3">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M21 4.49988V8.99988C21 9.1988 20.921 9.38956 20.7803 9.53021C20.6397 9.67087 20.4489 9.74988 20.25 9.74988H15.75C15.6016 9.75 15.4565 9.70608 15.333 9.62367C15.2096 9.54127 15.1133 9.42409 15.0565 9.28698C14.9997 9.14986 14.9849 8.99897 15.0139 8.8534C15.0428 8.70784 15.1144 8.57415 15.2194 8.46926L16.9359 6.74988C15.5551 5.42683 13.7183 4.68536 11.8059 4.67895H11.7638C9.80414 4.6751 7.92181 5.44299 6.52406 6.81645C6.38083 6.95015 6.19096 7.0225 5.99507 7.01801C5.79918 7.01351 5.61283 6.93254 5.47588 6.7924C5.33893 6.65227 5.26226 6.4641 5.26227 6.26816C5.26228 6.07222 5.33897 5.88407 5.47594 5.74395C7.14785 4.11043 9.38972 3.19145 11.7271 3.18148C14.0646 3.17151 16.3142 4.07131 18 5.69051L19.7213 3.96926C19.8262 3.86489 19.9598 3.79393 20.105 3.76531C20.2503 3.73669 20.4007 3.7517 20.5375 3.80843C20.6742 3.86517 20.7911 3.96111 20.8734 4.08415C20.9557 4.20719 20.9997 4.35185 21 4.49988ZM17.4759 17.1833C16.0867 18.5402 14.2253 19.3053 12.2834 19.3178C10.3415 19.3302 8.47053 18.5889 7.06406 17.2499L8.78063 15.5333C8.88661 15.4286 8.95899 15.2946 8.98853 15.1486C9.01808 15.0026 9.00346 14.851 8.94653 14.7133C8.8896 14.5756 8.79294 14.458 8.66889 14.3755C8.54483 14.2929 8.399 14.2492 8.25 14.2499H3.75C3.55109 14.2499 3.36032 14.3289 3.21967 14.4696C3.07902 14.6102 3 14.801 3 14.9999V19.4999C2.99988 19.6483 3.04381 19.7934 3.12621 19.9169C3.20861 20.0403 3.32579 20.1365 3.46291 20.1933C3.60002 20.2502 3.75092 20.265 3.89648 20.236C4.04204 20.207 4.17573 20.1355 4.28063 20.0305L6 18.3093C7.66144 19.9127 9.87852 20.8116 12.1875 20.818H12.2372C14.5885 20.8241 16.8476 19.9035 18.525 18.2558C18.662 18.1157 18.7387 17.9275 18.7387 17.7316C18.7387 17.5357 18.662 17.3475 18.5251 17.2074C18.3881 17.0672 18.2018 16.9863 18.0059 16.9818C17.81 16.9773 17.6201 17.0496 17.4769 17.1833H17.4759Z"
                                    fill="white" />
                                </svg>
                                <p className="text-[#FFFFFF] font-['Figtree'] leading-6">
                                  Re-generate
                                </p>
                              </div>
                              <div
                                className="flex justify-center items-center flex-row gap-2.5 bg-[rgba(255,255,255,0.1)] rounded-tl-xl w-[60px] h-[60px]"
                                style={{width: '60px'}}>
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M22.4728 6.95062L20.0691 15.6019C19.9369 16.0745 19.6542 16.4911 19.2639 16.7885C18.8736 17.0859 18.397 17.2479 17.9062 17.25H8.64C8.14784 17.2498 7.66926 17.0886 7.27725 16.791C6.88523 16.4935 6.6013 16.0758 6.46875 15.6019L3.18 3.75H1.5C1.30109 3.75 1.11032 3.67098 0.96967 3.53033C0.829018 3.38968 0.75 3.19891 0.75 3C0.75 2.80109 0.829018 2.61032 0.96967 2.46967C1.11032 2.32902 1.30109 2.25 1.5 2.25H3.75C3.91397 2.24997 4.07343 2.30367 4.20398 2.40289C4.33452 2.50211 4.42895 2.64138 4.47281 2.79938L5.36156 6H21.75C21.8656 5.99998 21.9797 6.02669 22.0833 6.07805C22.1869 6.1294 22.2772 6.20401 22.3472 6.29605C22.4171 6.38809 22.4649 6.49506 22.4867 6.60861C22.5085 6.72216 22.5037 6.83922 22.4728 6.95062ZM8.25 18.75C7.95333 18.75 7.66332 18.838 7.41665 19.0028C7.16997 19.1676 6.97771 19.4019 6.86418 19.676C6.75065 19.9501 6.72094 20.2517 6.77882 20.5426C6.8367 20.8336 6.97956 21.1009 7.18934 21.3107C7.39912 21.5204 7.66639 21.6633 7.95736 21.7212C8.24834 21.7791 8.54994 21.7494 8.82403 21.6358C9.09811 21.5223 9.33238 21.33 9.4972 21.0834C9.66203 20.8367 9.75 20.5467 9.75 20.25C9.75 19.8522 9.59196 19.4706 9.31066 19.1893C9.02936 18.908 8.64782 18.75 8.25 18.75ZM18 18.75C17.7033 18.75 17.4133 18.838 17.1666 19.0028C16.92 19.1676 16.7277 19.4019 16.6142 19.676C16.5006 19.9501 16.4709 20.2517 16.5288 20.5426C16.5867 20.8336 16.7296 21.1009 16.9393 21.3107C17.1491 21.5204 17.4164 21.6633 17.7074 21.7212C17.9983 21.7791 18.2999 21.7494 18.574 21.6358C18.8481 21.5223 19.0824 21.33 19.2472 21.0834C19.412 20.8367 19.5 20.5467 19.5 20.25C19.5 19.8522 19.342 19.4706 19.0607 19.1893C18.7794 18.908 18.3978 18.75 18 18.75Z"
                                    fill="white" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    }
            
            </div>
        </div>
      </div>
    </div>
    );
};

export default DrinkPage;

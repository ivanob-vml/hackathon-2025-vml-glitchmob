import React from 'react';

interface PromptStartProps {
  onPromptClick: (prompt: string) => void;
}

const PromptStart: React.FC<PromptStartProps> = ({ onPromptClick }) => {
  const promptStrings: string[] = [
    "Birthday party for 40 year old who likes Gin",
    "Gift for a 20th wedding anniversary, they like Whiskey",
    "Birthday outdoor day party in the summer with 20 people who like Vodka, citrus, and mint",
  ];     
  return (
      <div id="prompts" className="flex flex-wrap justify-start items-center flex-row gap-2 px-4 animate-fadeOut">
      <div className="flex gap-2.5 flex-wrap">
        {promptStrings.map((prompt, index) => (
          <div
            key={index}
            className="flex-1 justify-center items-center flex-row gap-2.5 py-2 px-3 bg-[#F4F4F4] border-solid border-[#4927AF] border rounded-lg w-[167px]"
            style={{width: '167px'}}>
                <p className="flex p-1 text-[#000000] items-center font-['Figtree'] justify-center" onClick={() => {
                onPromptClick(prompt);
                document.querySelector('div[id="prompts"]')?.classList.add('hidden');
                }}>
                {prompt}
                </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptStart;

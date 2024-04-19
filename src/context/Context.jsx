import { createContext, useState } from 'react';
import runChat from '../config/gemini';

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState('');
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState('');

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData('');
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt) {
      console.log('ttt prompt', prompt);
      setRecentPrompt(prompt);
      response = await runChat(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }
    let resp = response.split('**');
    let newResp = '';
    for (let i = 0; i < resp.length; i++) {
      if (i % 2 == 0) {
        newResp += resp[i];
      } else {
        newResp += `<b>${resp[i]}</b>`;
      }
    }
    let finalResp = newResp.split('*').join('<br/>');
    let finalRespData = finalResp.split(' ');
    for (let i = 0; i < finalRespData.length; i++) {
      const nextWord = finalRespData[i];
      delayPara(i, nextWord + ' ');
    }
    setLoading(false);
    setInput('');
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;

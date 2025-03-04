import React from 'react'
import { useState } from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { getSingleAssistant } from '../../api/assistantChatPageApi';
import { useEffect } from 'react';

const ConversationStarter = ({ states }) => {
    const {
       assistant_id,
       StarterQuestions,
       handleSelectStarter
    } = states
    const [starterQuestions, setStarterQuestions]= useState([])

    const fetchAssistantStarterQuestions = async()=>{
      const response = await getSingleAssistant(assistant_id)
      setStarterQuestions(response?.assistant?.static_questions)
  }

  useEffect(()=>{
    fetchAssistantStarterQuestions()
  },[assistant_id]);

  return (
      <div className='assistantsConversationStarterWrapper'>
        <div className="conversation-starter-box">
        {starterQuestions?.length > 0 && <p>Try saying ... </p>}
          {starterQuestions?.length > 0 &&
            starterQuestions.slice(-5).map((question, index) => (
                <div
                key={index}
                className='conversation-starter'
                onClick={() => handleSelectStarter(question)}
              >
                <div className='conversation-contents'>
                  <b>
                    {question.length > 70
                      ? `${question.slice(0, 70)} ...`
                      : question}
                  </b>
                  <FaArrowRight className='conversation-starter-icon' />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

export default ConversationStarter


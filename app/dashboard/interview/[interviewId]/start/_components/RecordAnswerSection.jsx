"use client"
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react'
import { toast } from "sonner";
import { chatSession } from '@/utils/GeminiAIModal'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'; 
import { UserAnswer } from '@/utils/schema';

function RecordAnswerSection({mockInterviewQuestion, activeQuestionIndex,interviewData}) {
    const [userAnswer, setUserAnswer]=useState('');
    const {user}=useUser();
    const [loading,setLoading]=useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(()=>{
        results.map((result)=>(
            setUserAnswer(prevAns=>prevAns+result?.transcript)
        ))

    },[results])

    useEffect(()=>{
        if(!isRecording&&userAnswer.length>10){
            UpdateUserAnswer();
        }
        

    },[userAnswer])


    const StartStopRecording=async()=>{
        if(isRecording){

            stopSpeechToText()
            
            }else{
                startSpeechToText();
            }
        }

    const UpdateUserAnswer=async()=>{
        setLoading(true)
        // Debugging: Check if interviewData and mockId exist
        console.log("Received interviewData:", interviewData);
        console.log("mockId:", interviewData?.mockId);

        // Handle missing mockId
        if (!interviewData?.mockId) {
            toast.error("Error: Mock Interview ID is missing!");
            setLoading(false);
            return;
        }
        const feedbackPrompt=`Question:${mockInterviewQuestion[activeQuestionIndex]?.question}
            , User Answer:${userAnswer} Depends on question and user answer for given interview question
            please give us rating for answer and feedback as area of improvement if any+
            in just 3 to 5 lines to improve it in JSON format with rating field and feedback field.`;

        try{
            const result=await chatSession.sendMessage(feedbackPrompt);

            const mockJsonResp=result.response.text().replace('```json','').replace('```','');
            console.log("AI Response JSON:",mockJsonResp);
            const JsonFeedbackResp=JSON.parse(mockJsonResp);

            if(interviewData?.mockId){
            const resp=await db.insert(UserAnswer)
            .values({
                mockIdRef:interviewData?.mockId,
                question:mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns:userAnswer,
                feedback:JsonFeedbackResp?.feedback,
                rating:JsonFeedbackResp?.rating,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-yyyy')
            })

            if(resp){
                toast.success('User Answer recorded successfully');
                setUserAnswer('');
                setResults([]);
            }
        }else{
            toast.error("Mock Interview ID is missing. Cannot record answer.");
        }
        }catch(error){
            console.error("Error updating user answer:", error);
            toast.error("Failed to record user answer. Please try again.");
        }
            //setResults([]);
            setLoading(false);

    }

  return (
    <div className='flex items-center justify-center flex-col'>
        <div className='flex flex-col mt-20 justify-center items-center bg-black roundex-lg p-5'>
            <Image src={'/webcam.webp'} width={200} height={200}
            className='absolute' alt="Webcam icon"/>
            <Webcam
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,
            }}/>
        </div>
        <Button
        disabled={loading}
        variant="outline" className="my-10"
        onClick={StartStopRecording}>
            {isRecording?
            <h2 className='text-red-600 flex gap-2'>
                <Mic/> Stop Recording
            </h2>
            :
            
            'Record Answer'}</Button>

        {/* <Button onClick={()=>console.log(userAnswer)}>Show Answer</Button> */}
    </div>
  )
}

export default RecordAnswerSection
















// "use client"
// import Image from 'next/image'
// import React,{useState, useEffect} from 'react'
// import Webcam from 'react-webcam'
// import { Button } from '@/components/ui/button'
// import useSpeechToText from 'react-hook-speech-to-text';
// import { Mic } from 'lucide-react'

// function RecordAnswerSection() {
//   const [userAnswer,setUserAnswer]=useState('');
//   const {
//     error,
//     interimResult,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false
//   });

//   useEffect(()=>{
//     results.map((result)=>(
//       setUserAnswer(prevAns=>prevAns+result.transcript)
//     ))
//   },[results])

//   return (
//     <div className='flex items-center justify-center flex-col'>
//         <div className='flex flex-col my-20 justify-center bg-black rounded-lg p-5'>
//         <Image src={'/webcam.webp'} width={200} height={200} className='absolute' alt='webcam image'/>
    
//         <Webcam
//           mirrored={true}
//           style={{
//           height:300,
//           width:'100%',
//           zIndex:10,
//         }}
//       />
//         </div>
//         <Button variant="outline" className="my-10">
//           {isRecording?
//           <h2 className='text-red-600 flex gap-2'>
//             <Mic/> Stop Recording
//           </h2>
//           :

//           'Record Answer'}</Button>
//       <Button onClick={()=>console.log(userAnswer)}>Show Answer</Button>    
        
//     </div>
//   )
// }

// export default RecordAnswerSection










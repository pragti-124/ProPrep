// "use client"
// import { db } from '@/utils/db';
// import { MockInterview } from '@/utils/schema';
// import { eq } from 'drizzle-orm';
// import React, { useEffect, useState }from 'react';
// import QuestionsSection from './_components/QuestionsSection';


// function StartInterview({params}) {
  
//   const [interviewData,setInterviewData]=useState();
//   const [mockInterviewQuestion,setMockInterviewQuestion]=useState();
//   useEffect(()=>{
//     GetInterviewDetails();

//   },[]);

//   const GetInterviewDetails=async()=>{
//         const result=await db.select().from(MockInterview)
//         .where(eq(MockInterview.mockId,params.interviewId))

//         const jsonMockResp=JSON.parse(result[0].jsonMockResp);
//         console.log(jsonMockResp)
//         setMockInterviewQuestion(jsonMockResp);
//         setInterviewData(result[0]);  
//       }

//   return (
//     <div>
//       <div className='grid grid-cols-1 md:grid-cols-2'>
//         {/* Questions */}
//         <QuestionsSection mockInterviewQuestion={mockInterviewQuestion}/>

//         {/* Video/ Audio Recording */}

//       </div>
//     </div>
//   )
// }

// export default StartInterview






"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview() {
  const params = useParams();  // Use useParams() to get dynamic route parameters
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);

  useEffect(() => {
    if (params?.interviewId) {
      GetInterviewDetails(params.interviewId);
    }
  }, [params?.interviewId]);

  const GetInterviewDetails = async (interviewId) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        console.log(jsonMockResp);
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Questions */}
        <QuestionsSection 
          mockInterviewQuestion={mockInterviewQuestion} 
          activeQuestionIndex = {activeQuestionIndex}
        />

        {/* Video/ Audio Recording */}
        <RecordAnswerSection
         mockInterviewQuestion={mockInterviewQuestion} 
         activeQuestionIndex = {activeQuestionIndex}
         interviewData={interviewData || {mockId: "default_mock_id"}}
         />
      </div>
      <div className='flex justify-end gap-6'>
        {activeQuestionIndex>0&& 
        <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
        {activeQuestionIndex!=mockInterviewQuestion?.length-1&& 
        <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
        {activeQuestionIndex==mockInterviewQuestion?.length-1&& 
        <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
        <Button>End Interview</Button>
        </Link>}
      </div>
    </div>
  );
}

export default StartInterview;










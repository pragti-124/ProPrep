// "use client"
// import React, { useEffect , useState} from 'react'
// import { db } from '@/utils/db'
// import { eq } from 'drizzle-orm'
// import { MockInterview } from '@/utils/schema'
// import { use } from 'react'
// import Webcam from 'react-webcam'
// import { Lightbulb, WebcamIcon } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import Link from "next/link";


// function Interview({params}) {
//     const resolvedParams = use(params);
    
    
//     const [interviewData,setInterviewData]=useState();
//     const [webCamEnabled,setWebCamEnabled]=useState(false);
    
//     useEffect(()=>{
//         console.log(resolvedParams.interviewId)
//         GetInterviewDetails();
//     },[resolvedParams.interviewId]);

//     const GetInterviewDetails=async()=>{
//       const result=await db.select().from(MockInterview)
//       .where(eq(MockInterview.mockId,resolvedParams.interviewId))

//       setInterviewData(result[0]);
//     }
//     if (!interviewData) {
//       return <div>Loading...</div>; // Add loading state while data is being fetched
//   }
//   return (
//     <div className='my-10 '>
//       <h2 className='font-bold text-2xl'>Let's Get Started</h2>
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

//       <div className='flex flex-col my-5 gap-5'>
//         <div className='flex flex-col my-5 gap-5 p-5 rounded-lg border'>
//         <h2 className='text-lg'><strong>Job Role/Job Position:</strong>{interviewData.jobPosition}</h2>
//         <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong>{interviewData.jobDesc}</h2>
//         <h2 className='text-lg'><strong>Years of Experience:</strong>{interviewData.jobExperience}</h2>
//         </div>
//         <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
//           <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
//           <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
//         </div>
//       </div>

//       <div>
//         {webCamEnabled? <Webcam 
//         onUserMedia={()=>setWebCamEnabled(true)}
//         onUserMediaError={()=>setWebCamEnabled(false)}
//         mirrored={true}
//         style={{
//           height:300,
//           width:300
//         }}
//         />
//         :
//         <>
//         <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
//         <div className='flex justify-center items-center'>
//         <Button variant="ghost" onClick={()=>setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
//         </div>
//         </>
//         } 
//       </div>

//     </div>
//     <div className='flex justify-end items-end'>
//       <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
//       <Button>Start Interview</Button>
//       </Link>
    
//     </div>
    
      
      
//     </div>
//   )
// }

// export default Interview







"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Interview() {
  const params = useParams(); // This now works in a Client Component
  
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    if (params?.interviewId) {
      console.log("Interview ID:", params.interviewId);
      GetInterviewDetails(params.interviewId);
    }
  }, [params?.interviewId]);

  const GetInterviewDetails = async (interviewId) => {
    if (!interviewId) return;
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      setInterviewData(result[0] || null);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  if (!params?.interviewId || !interviewData) {
    return <div>Loading...</div>; // Show loading state until data is available
  }

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col my-5 gap-5 p-5 rounded-lg border">
            <h2 className="text-lg">
              <strong>Job Role/Job Position:</strong> {interviewData.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience:</strong> {interviewData.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{ height: 300, width: 300 }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <div className="flex justify-center items-center">
                <Button variant="ghost" onClick={() => setWebCamEnabled(true)}>
                  Enable Web Cam and Microphone
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;

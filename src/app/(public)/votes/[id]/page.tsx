import {cookies} from "next/headers";
import PollDetail from '@/components/PollDetail';


export default async function PollPage({params}:{params: {id:string}}) {
  const pollId = await params.id;
  const Cookie = await cookies();
  const cookieStr = Cookie.toString();
  let poll = [];
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/polls/${pollId}`, {
      headers: {
        Cookie: cookieStr
      }
    });
    const pollData = await res.json();
    poll = pollData.poll;
  } catch(error){
    console.log("error(polls page err):", error);
  }
 
  return (
    <PollDetail poll={poll}/>
  )
}
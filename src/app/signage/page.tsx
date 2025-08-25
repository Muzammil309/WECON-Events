import { mockSessions } from '@/data/agenda';
export default function SignagePage(){
  const now=Date.now();
  const upcoming=[...mockSessions].sort((a,b)=> +new Date(a.startAt) - +new Date(b.startAt));
  const current=upcoming.find(s=> +new Date(s.startAt)<=now && +new Date(s.endAt)>=now);
  const next=upcoming.find(s=> +new Date(s.startAt)>now);
  return (
    <div className="min-h-[70vh] grid gap-8">
      <section className="rounded-3xl p-8 bg-black text-white">
        <h2 className="text-sm uppercase opacity-70">Now</h2>
        <p className="text-3xl sm:text-5xl font-extrabold mt-2">{current? current.title:'No session in progress'}</p>
        <p className="opacity-80 mt-2">{current? `${new Date(current.startAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}  ${new Date(current.endAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`:''}</p>
      </section>
      <section className="rounded-3xl p-8 bg-white">
        <h2 className="text-sm uppercase opacity-70">Next</h2>
        <p className="text-2xl sm:text-4xl font-extrabold mt-2">{next? next.title:'No upcoming session'}</p>
        <p className="opacity-80 mt-2">{next? `${new Date(next.startAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}  ${new Date(next.endAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`:''}</p>
      </section>
    </div>
  );
}

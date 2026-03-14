export default function Blobs() {
  return (
    <>
      <div className="blob w-[500px] h-[500px] opacity-20 -top-40 -left-32" style={{ background:'#C4B5FD', filter:'blur(100px)' }} />
      <div className="blob w-[400px] h-[400px] opacity-15 top-20 -right-20" style={{ background:'#A5F3E0', filter:'blur(90px)' }} />
      <div className="blob w-[300px] h-[300px] opacity-10 bottom-10 left-1/3" style={{ background:'#FCA5B8', filter:'blur(80px)' }} />
    </>
  )
}

function Pagination({pages,setPage}){

 const numbers = [...Array(pages).keys()]

 return(

  <div style={{marginTop:"20px"}}>

   {numbers.map(x=>(
    <button
     key={x+1}
     onClick={()=>setPage(x+1)}
    >
     {x+1}
    </button>
   ))}

  </div>

 )
}

export default Pagination
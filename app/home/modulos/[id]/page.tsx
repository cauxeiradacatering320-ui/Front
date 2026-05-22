export default async function Page({ params: params }: { params: { id: string } }){
    const id = await params
    
    return(
        <div>   
            <h1>Modulo</h1>
        </div>
    )
}
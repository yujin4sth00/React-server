import Button from "react-bootstrap/esm/Button";

const CustomerDelete=(props)=>{

    const deleteCustomer=(id)=>{
        console.log('deleteCustomer()-> ');
        const url='http://localhost:3000/api/customerDelete';

        fetch(url,{
            method:'post',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                id:id
            })
        }).then((res)=>{
            if(res.ok){
                alert('해당 내용을 삭제하였습니다!');
                //삭제된 내용 확인
                window.location.reload();
            }
        });
    }

    return(
        // <button onClick={()=>{
        //     deleteCustomer(props.id);
        // }}>삭제</button>
        <Button variant="outline-danger" onClick={()=>{
            deleteCustomer(props.id);
        }}>
        삭제
      </Button>
    )
}

export default CustomerDelete;
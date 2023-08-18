import CustomerDelete from "./CustomerDelete"
import CustomerModify from "./CustomerModify"

const Customer=(props)=>{
    return(
        <>
           <tr>
            <td>{props.id}</td>
            <td><img src={props.image} width="30px" height="30px" /></td>
            <td>{props.name}</td>
            <td>{props.birthday}</td>
            <td>{props.job}</td>
            <td>
                <CustomerModify id={props.id} name={props.name} birthday={props.birthday} job={props.job} />
                <span style={{margin:'5px'}}></span>
                <CustomerDelete id={props.id} /></td>
           </tr>
        </>
    )
}

const Customer_prev=(props)=>{
    return(
        <div>
           <CustomerProfile id={props.id} name={props.name} image={props.image} />
           <CustomerInfo birthday={props.birthday} job={props.job} />
        </div>
    )
}

const CustomerProfile=(props)=>{
    return(
        <div>
            <img src={props.image} width="30px" height="30px"></img>
            <h2>{props.name} (id : {props.id})</h2>
        </div>
    )
}

const CustomerInfo=(props)=>{
    return(
        <div>
            <p>{props.birthday}</p>
            <p>{props.job}</p>
        </div>
    )
}

export default Customer;
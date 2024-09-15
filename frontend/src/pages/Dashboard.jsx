import { Appbar } from "../Components/Appbar"
import { Balance } from "../Components/Balance"
import { Users } from "../Components/Users"
export function Dashboard (){
    return  <div>
    <Appbar />
    <div className="m-8">
        <Balance value={"10,000"} />
        <Users />
    </div>
</div>
}
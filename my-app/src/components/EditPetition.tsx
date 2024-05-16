import { useNavigate, useParams } from "react-router-dom";
import { useUserAuthDetailsContext } from "../utils/userAuthContext";

const EditPetition = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userAuth = useUserAuthDetailsContext();

    return (
        <>
            <h1>test</h1>
        </>
    );
};

export default EditPetition;

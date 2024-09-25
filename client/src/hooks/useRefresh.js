import axios from "../api/axios";
import useAuth from "./useAuth";

function useRefresh() {
    const { setAuthState } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        })
        setAuthState(prev => {
            return { ...prev, token: response.data.accessToken };
        })
        return response.data.accessToken;
    };
    return refresh;
}

export default useRefresh;

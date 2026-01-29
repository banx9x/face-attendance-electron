import { useSelector } from "react-redux";
import authSlice from "../store/auth/auth.slice";
import LoginForm from "../components/LoginForm";
import DataForm from "../components/DataForm";

const Data: React.FC = () => {
  const isAuthenticated = useSelector(authSlice.selectors.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="max-w-120 mx-auto">
        <LoginForm />
      </div>
    );
  }

  return <DataForm />;
};

export default Data;

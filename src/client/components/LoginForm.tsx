import { Button, Form, Input } from "antd";
import { authApi } from "../store/auth/auth.api";
import { getErrorMessage } from "../utils/error";

type LoginFormValues = {
  username: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const [login, { isLoading, error }] = authApi.useLoginMutation();

  return (
    <Form form={form} onFinish={login} layout="vertical">
      <Form.Item label="Tài khoản" name="email">
        <Input />
      </Form.Item>
      <Form.Item label="Mật khẩu" name="password">
        <Input.Password />
      </Form.Item>
      <Form.Item>
        {error && (
          <div className="mb-4 text-red-500">{getErrorMessage(error)}</div>
        )}
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;

import { Flex, Tabs, TabsProps } from "antd";
import {
  DatabaseOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Data from "./screens/Data";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Hướng dẫn sử dụng",
    icon: <HomeOutlined />,
    children: <div>Welcome to the Face Attendance System!</div>,
  },
  {
    key: "2",
    label: "Dữ liệu",
    icon: <DatabaseOutlined />,
    children: <Data />,
  },
  {
    key: "3",
    label: "Điểm danh",
    icon: <UserOutlined />,
    children: <div>Settings content goes here.</div>,
  },
];

const App = () => {
  return (
    <Flex vertical gap="middle">
      <h1>Face Attendance System</h1>

      <Tabs defaultActiveKey="1" items={items} />
    </Flex>
  );
};

export default App;

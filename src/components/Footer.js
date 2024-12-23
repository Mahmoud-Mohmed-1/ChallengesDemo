import {Typography} from "antd";
import {
    FacebookFilled,
    FacebookOutlined, GithubFilled,
    GithubOutlined,
    InstagramFilled,
    InstagramOutlined, LinkedinFilled,
    LinkedinOutlined
} from "@ant-design/icons";

export default function Footer() {
    const date = new Date();
    return (
        <div className={"bg-white  "}>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className={"flex flex-col justify-between items-center"}>
                <div className={"text-3xl text-gray-600 flex gap-5 "}>
<FacebookOutlined/>
                    <InstagramOutlined/>
                    <GithubOutlined/>
                    <LinkedinOutlined/>
                </div>
                <Typography.Paragraph className={"text-sm text-gray-600 font-medium"}>
                    &copy; {date.getFullYear()} With MaNo All rights reserved ❤
                </Typography.Paragraph>
                    <Typography.Paragraph className={"text-sm text-gray-600 font-medium"}>
                        It's not easy to be me &lt;3 "MaNo😉"
                    </Typography.Paragraph>

            </div>
        </div>
        </div>
    )
}
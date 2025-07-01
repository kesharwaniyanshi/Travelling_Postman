// import from "/cha"

import Chatbot from "../Chatbot/page";

const AdminLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <Chatbot > {children}</Chatbot>
                {/* {children} */}
            </body>
        </html>
    );
};

export default AdminLayout;
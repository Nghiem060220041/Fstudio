import { DashboardClient } from "./client";

interface DashboardPageProps {};

const DashboardPage: React.FC<DashboardPageProps> = async ({
}) => {

    return (
    <div className="container">
        <DashboardClient/>
    </div>
    );
};

export default DashboardPage;
interface DashboardPageProps {
    params: {storeId: string}
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
    params
}) => {
    return (
        <div className="container">
            {/* Active store: {store?.name} */}
        </div>
    );
};

export default DashboardPage;
import ResponsiveAppBar from "./test/Header";
import ProductList from "./ProductList";
const Dashboard = () => {
  return (
    <div>
      <ResponsiveAppBar />
      <div style={{ padding: "20px" }}>
        <ProductList />
      </div>
    </div>
  );
};

export default Dashboard;

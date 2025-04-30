import StatusAdminHeader from "../components/StatusAdminHeader";
import StatusPieChart from "../components/StatusPieChart";
import TopSelling from "../components/TopSelling";

function StatusAnalysis() {
  return (
    <>
      <StatusAdminHeader title="Analysis" />
      <div className="grid grid-cols-2 gap-4 overflow-auto max-h-[80vh]">
        <div className="col-span-2">
          <StatusPieChart />
        </div>
        <div className="col-span-2">
          <TopSelling />
        </div>
      </div>
    </>
  );
}

export default StatusAnalysis;

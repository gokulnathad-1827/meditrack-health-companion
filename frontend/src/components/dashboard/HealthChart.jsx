import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { day: "Mon", bp: 120 },
    { day: "Tue", bp: 118 },
    { day: "Wed", bp: 122 },
    { day: "Thu", bp: 117 },
    { day: "Fri", bp: 121 },
    { day: "Sat", bp: 119 },
    { day: "Sun", bp: 120 },
];

function HealthChart() {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">
                Weekly Blood Pressure
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="bp"
                        stroke="#10b981"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default HealthChart;
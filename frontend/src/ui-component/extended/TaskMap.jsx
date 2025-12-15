import { Card, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function TaskMap({ tasks = [], isLoading }) {
  const center = [10.7769, 106.7009]; // HCM default

  console.log("Check task: ", tasks);
  return (
    <Card sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Bản đồ nhiệm vụ
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Hiển thị vị trí các sự cố được giao
      </Typography>

      {isLoading ? (
        <Typography>Loading map...</Typography>
      ) : (
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: 500, width: "100%", borderRadius: 12 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {tasks.map((task) => {
            if (!task.location?.coordinates) return null;

            const [lng, lat] = task.location.coordinates;

            return (
              <Marker key={task._id} position={[lat, lng]}>
                <Popup>
                  <b>{task.type_id?.name}</b>
                  <br />
                  Status: {task.status}
                  <br />
                  Priority: {task.priority}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </Card>
  );
}

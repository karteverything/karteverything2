import UploadPanel from "../components/UploadPanel";
import PortraitGallery from "../components/PortraitGallery";
import SessionGuard from "../components/SessionGuard";

export default function Dashboard() {
  return (
    <SessionGuard>
      <div className="admin-wrapper">
        <UploadPanel />
        <PortraitGallery />
      </div>
    </SessionGuard>
  );
}
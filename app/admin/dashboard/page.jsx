import UploadPanel from "@/components/admin/UploadPanel";
import PortraitGallery from "@/components/admin/PortraitGallery";
import SessionGuard from "@/components/admin/SessionGuard";

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
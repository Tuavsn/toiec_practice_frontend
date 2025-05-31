import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/Header-Logo.png";
import { useTestState } from "../../../context/TestStateProvider";
import { useNotification } from "../../../hooks/NotificationHook";
import { AmINotLoggedIn } from "../../../utils/helperFunction/AuthCheck";
import NotificationPanel from "../../User/Notification/NotificationPanel";
import LoginDialog from "../LoginDialog/LoginDialog";





//------------------------------------------------------
// Header Component
//------------------------------------------------------
export default function Header() {
  const navigate = useNavigate();
  const userProfilePanelRef = useRef<OverlayPanel>(null); // Renamed 'op' for clarity
  const notificationPanelRef = useRef<OverlayPanel>(null); // Ref for notification panel

  const { isOnTest } = useTestState();

  //------------------------------------------------------
  // Notification Hook Usage
  //------------------------------------------------------
  const { unreadCount } = useNotification(); // Get unread count for the badge

  const HeaderStart = <a href="#"><img src={Logo} height={70} alt="Logo" onClick={() => handleCommand('/home')} /></a>;

  const HeaderItems: MenuItem[] = [
    { label: 'Bài học', icon: 'pi pi-book', command: () => handleCommand('/lecture') },
    { label: 'Đề thi', icon: 'pi pi-folder', command: () => handleCommand('/test') },
    { label: 'Luyện tập', icon: 'pi pi-book', command: () => handleCommand('/exercise') },
    { label: 'Tra cứu', icon: 'pi pi-search', command: () => handleCommand('/lookup') },
  ];

  if (localStorage.getItem('role') === 'ADMIN') {
    HeaderItems.push({ label: 'Quản lý', icon: 'pi pi-cog', command: () => handleCommand('/dashboard/') });
  }

  // Toggle user profile OverlayPanel
  const toggleUserProfilePanel = (e: React.MouseEvent<HTMLElement>) => {
    userProfilePanelRef.current?.toggle(e);
  };

  //------------------------------------------------------
  // Notification Panel Toggle
  //------------------------------------------------------
  const toggleNotificationPanel = (event: React.MouseEvent<HTMLElement>) => {
    notificationPanelRef.current?.toggle(event);
  };

  const HeaderEnd = AmINotLoggedIn() ?
    <LoginDialog /> :
    (
      <div className="flex align-items-center gap-2 pr-3"> {/* Use gap for spacing */}
        {/* Notification Bell Icon & Panel */}
        <Button
          icon="pi pi-bell"
          rounded
          text
          severity="info"
          aria-label="Notifications"
          onClick={toggleNotificationPanel}
          className="p-overlay-badge" // Class to help position the badge
        >
          {unreadCount > 0 && (
            <Badge value={unreadCount > 99 ? "99+" : unreadCount} severity="danger"></Badge>
          )}
        </Button>
        <OverlayPanel ref={notificationPanelRef} dismissable={true} showCloseIcon={false} style={{width: '380px'}}>
          {/* Pass callback to allow panel to close itself */}
          <NotificationPanel onClosePanel={() => notificationPanelRef.current?.hide()} />
        </OverlayPanel>

        {/* User Email and Profile */}
        <div className="m-auto pr-1 text-sm"> {/* Reduced padding right */}
          {localStorage.getItem('email')}
        </div>
        <Button
            icon="pi pi-user"
            rounded
            text
            raised // Keep consistent styling if desired
            severity="info"
            aria-label="User"
            onClick={toggleUserProfilePanel}
        />
        <OverlayPanel ref={userProfilePanelRef} dismissable={true}> {/* Added dismissable */}
          <div className="flex flex-column gap-2" style={{minWidth: '150px'}}> {/* Use flex column and gap */}
            <Button
              label="Cá nhân"
              icon="pi pi-user-edit"
              className="p-button-text p-button-plain w-full text-left" // Ensure full width and text alignment
              onClick={(e) => { toggleUserProfilePanel(e as any); navigate('/profile'); }}
            />
            <Button
              label="Thoát"
              icon="pi pi-sign-out"
              className="p-button-text p-button-plain p-button-danger w-full text-left" // Danger style and alignment
              onClick={() => {
                userProfilePanelRef.current?.hide(); // Hide panel before clearing
                localStorage.clear();
                navigate('/home');
              }}
            />
          </div>
        </OverlayPanel>
      </div>
    );

  const handleCommand = (path: string) => {
    if (isOnTest) {
      alert('Bạn không thể điều hướng trong khi đang làm bài kiểm tra!');
    } else {
      navigate(path);
    }
  };

  return (
    !isOnTest && (
      <div className="fixed top-0 left-0 right-0 z-5">
        <Menubar model={HeaderItems} start={HeaderStart} end={HeaderEnd} />
\
      </div>
    )
  );
}
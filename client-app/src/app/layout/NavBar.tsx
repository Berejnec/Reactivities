import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Dropdown, Icon, Image, Menu, Sidebar } from "semantic-ui-react";
import { useStore } from "../stores/store";

export default observer(function NavBar() {
  const {
    userStore: { user, logout },
  } = useStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Menu inverted fixed="top" className="shadow" size="large">
        <Container>
          <Menu.Item as={NavLink} to="/" header className="d-flex gap-3">
            <img src="/assets/logo.png" alt="logo" />
            HikeConnect
          </Menu.Item>

          <Menu.Item as={NavLink} to="/activities" name="Activities" className="menu-item" />
          {import.meta.env.DEV && <Menu.Item as={NavLink} to="/errors" name="Errors" className="menu-item" />}
          <Menu.Item className="menu-item">
            <Button as={NavLink} to="/createActivity" positive content="Create Activity" />
          </Menu.Item>
          <Menu.Item position="right" className="menu-item">
            <Image src={user?.image || "/assets/user.png"} avatar spaced="right" />
            <Dropdown text={user?.displayName} pointing="top left">
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} text="My Profile" icon="user" />
                <Dropdown.Item onClick={logout} text="Logout" icon="power" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>

          <Menu.Item position="right" className="hamburger-item">
            <Icon name="sidebar" size="large" onClick={handleSidebarToggle} style={{ cursor: "pointer" }} />
          </Menu.Item>
        </Container>
      </Menu>

      <Sidebar
        as={Menu}
        animation="overlay"
        direction="left"
        onHide={() => setSidebarOpen(false)}
        vertical
        visible={sidebarOpen}
        inverted
      >
        <Menu.Item as={NavLink} to="/" header onClick={() => setSidebarOpen(false)}>
          <img src="/assets/logo.png" alt="logo" />
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="Activities" onClick={() => setSidebarOpen(false)} />
        {import.meta.env.DEV && (
          <Menu.Item as={NavLink} to="/errors" name="Errors" onClick={() => setSidebarOpen(false)} />
        )}
        <Menu.Item onClick={() => setSidebarOpen(false)}>
          <Button as={NavLink} to="/createActivity" positive content="Create Activity" />
        </Menu.Item>
        <Menu.Item>
          <Image src={user?.image || "/assets/user.png"} avatar spaced="right" />
          <Dropdown text={user?.displayName} pointing="top left">
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} text="My Profile" icon="user" />
              <Dropdown.Item onClick={logout} text="Logout" icon="power" />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Sidebar>
    </>
  );
});

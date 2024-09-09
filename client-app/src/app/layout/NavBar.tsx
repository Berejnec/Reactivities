import { NavLink } from "react-router-dom";
import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
  const {
    userStore: { user, logout },
  } = useStore();
  return (
    <Menu inverted fixed="top" className="shadow">
      <Container>
        <Menu.Item as={NavLink} to="/" header className="d-flex gap-3">
          <img src="/assets/logo.png" alt="logo" />
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="Activities" />
        <Menu.Item as={NavLink} to="/errors" name="Errors" />
        <Menu.Item>
          <Button as={NavLink} to="/createActivity" positive content="Create Activity" />
        </Menu.Item>
        <Menu.Item position="right">
          <Image src={user?.image || "/assets/user.png"} avatar spaced="right" />
          <Dropdown text={user?.displayName} pointing="top left">
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} text="My Profile" icon="user" />
              <Dropdown.Item onClick={logout} text="Logout" icon="power" />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
});

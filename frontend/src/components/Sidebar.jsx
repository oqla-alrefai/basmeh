import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';

const Sidebar = () => {
  return (
    <Drawer variant="permanent">
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/admin/users">
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button component={Link} to="/admin/products">
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button component={Link} to="/admin/carts">
          <ListItemText primary="Carts" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

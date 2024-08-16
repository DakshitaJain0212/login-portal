
import React, { useState } from 'react';
import { Layout, Menu, Drawer } from 'antd';
import { Link } from 'react-router-dom';
import { MenuOutlined, HomeOutlined, FilePdfOutlined, PictureOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './PdfViewerPage';
import PdfEditorPage from './PdfEditorPage'; 
import PdfImageEditorPage from './PdfImageEditor';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Header, Content } = Layout;

const Navbar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const onClose = () => setDrawerVisible(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header
        style={{
          background: '#001529',
          color: '#fff',
          padding: '0 16px',
          position: 'fixed',
          width: '100%',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div className="logo" style={{ flex: 1 }}>
          <h1 style={{ color: '#fff', margin: '0', fontSize: '24px' }}>PDF Editor</h1>
        </div>
        {/* Navbar for larger screens */}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ background: '#001529', lineHeight: '64px', flex: 1 }}
        >
           <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Pdf Viewer</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FilePdfOutlined />}>
            <Link to="/pdf-editor">Pdf Page Editor</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<PictureOutlined />}>
            <Link to="/pdf-image-editor">Pdf Image Editor</Link>
          </Menu.Item>
        </Menu>
        {/* Mobile Menu Button */}
        <MenuOutlined
          style={{ color: '#fff', fontSize: '24px', cursor: 'pointer' }}
          onClick={showDrawer}
        />
      </Header>

      {/* Sidebar Drawer for mobile */}
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={onClose}
        visible={drawerVisible}
        style={{ padding: 0 }}
      >
        <Menu
          theme="light"
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Pdf Viewer</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FilePdfOutlined />}>
            <Link to="/pdf-editor">Pdf Editor</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<PictureOutlined />}>
            <Link to="/pdf-image-editor">Pdf Image Editor</Link>
          </Menu.Item>
        </Menu>
      </Drawer>

      {/* Content */}
      <Layout style={{ marginTop: 64, padding: '24px' }}>
        <Content style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pdf-editor" element={<DndProvider backend={HTML5Backend}><PdfEditorPage /></DndProvider>} />
            <Route path="/pdf-image-editor" element={<DndProvider backend={HTML5Backend}><PdfImageEditorPage /></DndProvider>} />
            
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Navbar;

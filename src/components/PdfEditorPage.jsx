import React, { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Select, Card, List, Typography } from "antd";
import { useDropzone } from "react-dropzone";
import {
  addNewPage,
  deletePage,
  reorderPages,
  setPdfData,
} from "../store/actions/action";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PdfTextEditor from "./PdfTextEditor";
import PdfImageEditor from "./PdfImageEditor";
import PdfViewer from "./PdfViewer";

const { Option } = Select;
const { Title } = Typography;
const ItemType = "PAGE";

const DraggablePage = ({ page, index, movePage }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex !== hoverIndex) {
        movePage(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { type: ItemType, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        padding: "8px",
        marginBottom: "8px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "4px",
        opacity: isDragging ? 0.5 : 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "move",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <span>Page {page + 1}</span>
    </div>
  );
};

const PdfEditorPage = () => {
  const dispatch = useDispatch();
  const pdfUrl = useSelector((state) => state.pdfEditor.pdfData);
  const pageOrder = useSelector((state) => state.pdfEditor.pageOrder);
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const pdfDataUrl = reader.result;
        dispatch(setPdfData(pdfDataUrl));
      };
      reader.readAsDataURL(file);
    },
    [dispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "application/pdf",
  });

  const movePage = (dragIndex, hoverIndex) => {
    const newOrder = [...pageOrder];
    const [movedPage] = newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, movedPage);
    dispatch(reorderPages(newOrder));
  };

  const handleAddPage = () => {
    dispatch(addNewPage(pdfUrl));
  };

  const handleDeletePage = () => {
    if (selectedPageIndex !== null) {
      dispatch(deletePage(selectedPageIndex));
      setSelectedPageIndex(null);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          padding: "24px",
          background: "#f5f5f5",
        }}
      >
        <div style={{ flex: "1", marginRight: "24px", overflow: "auto" }}>
          <Card
            title={<Title level={4}>Page Management</Title>}
            bordered={false}
            style={{ marginBottom: "24px" }}
          >
            <Button
              type="primary"
              onClick={handleAddPage}
              style={{ marginBottom: "16px" }}
            >
              Add Page
            </Button>
            <Select
              placeholder="Select page to delete"
              style={{ width: "100%", marginBottom: "16px" }}
              onChange={(value) => setSelectedPageIndex(value)}
              value={selectedPageIndex}
            >
              {pageOrder?.map((page, index) => (
                <Option key={index} value={index}>
                  Page {page + 1}
                </Option>
              ))}
            </Select>
            <Button
              onClick={handleDeletePage}
              type="primary"
              danger
              style={{ width: "100%" }}
            >
              Delete Selected Page
            </Button>
          </Card>
          <Card title={<Title level={4}>Reordered Pages</Title>} bordered={false}>
            <div style={{ padding: "8px" }}>
              {pageOrder?.length > 0 ? (
                <List
                  dataSource={pageOrder}
                  renderItem={(page, index) => (
                    <DraggablePage
                      key={page}
                      index={index}
                      page={page}
                      movePage={movePage}
                    />
                  )}
                />
              ) : (
                <Typography.Text>No pages available</Typography.Text>
              )}
            </div>
          </Card>
          <Card
          title={<Title level={4}>PDF Text Editor</Title>}
          bordered={false}
          style={{
            marginTop: '24px',
            marginBottom: '24px',
            padding: '24px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
         <PdfTextEditor/>
        </Card>
        </div>

        <div style={{ flex: "1", borderLeft: "1px solid #ddd", paddingLeft: "24px", overflow: "hidden" }}>
          {pdfUrl ? (
            <div style={{ height: "100%", overflow: "hidden" }}>
              <PdfViewer pdfUrl={pdfUrl} />
            </div>
          ) : (
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #1890ff",
                padding: "24px",
                textAlign: "center",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input {...getInputProps()} />
              <p>Drag & drop a PDF file here, or click to select one</p>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default PdfEditorPage;

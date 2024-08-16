import React, { useState, useCallback } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Slider,
  Button,
  Card,
  Typography,
  Layout,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addImageToPdf, setPdfData } from "../store/actions/action";
import PdfViewer from "./PdfViewer";
import { useDropzone } from "react-dropzone";
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;
const ItemType = "IMAGE";

const PdfImageEditor = () => {
  const dispatch = useDispatch();
  const pdfUrl = useSelector((state) => state.pdfEditor.pdfData);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [localImage, setLocalImage] = useState(null);

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

  const handleImageUpload = (file) => {
    if (!file || !(file instanceof Blob)) {
      message.error("Invalid file type. Please upload an image.");
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newImage = {
        id: 1,
        src: reader.result,
        left: 100,
        top: 100,
        width: 200,
        height: 200,
        rotation: 0,
        opacity: 1,
      };
      setImage(newImage);
      setLocalImage(newImage);
      setCurrentImage(newImage.id);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const moveImage = useCallback(
    (position) => {
      if (localImage) {
        const updatedImage = { ...localImage, ...position };
        setLocalImage(updatedImage);
      }
    },
    [localImage]
  );

  const resizeImage = useCallback(
    (size) => {
      if (localImage) {
        const containerWidth = 500;
        const containerHeight = 500;
        const newWidth = Math.min(size.width, containerWidth);
        const newHeight = Math.min(size.height, containerHeight);
        const updatedImage = {
          ...localImage,
          width: newWidth,
          height: newHeight,
        };
        setLocalImage(updatedImage);
      }
    },
    [localImage]
  );

  const rotateImage = useCallback(
    (angle) => {
      if (localImage) {
        const updatedImage = { ...localImage, rotation: angle };
        setLocalImage(updatedImage);
      }
    },
    [localImage]
  );

  const adjustOpacity = useCallback(
    (opacity) => {
      if (localImage) {
        const updatedImage = { ...localImage, opacity };
        setLocalImage(updatedImage);
      }
    },
    [localImage]
  );

  const handleSave = () => {
    if (localImage) {
      dispatch(addImageToPdf(localImage));
    }
  };

  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveImage({ left, top });
    },
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout
        style={{ minHeight: "100vh", padding: "24px", background: "#f0f2f5" }}
      >
        <Content>
          <Row gutter={[24, 24]} style={{ height: "100%" }}>
            <Col xs={24} lg={12}>
              <Card
                title={<Title level={4}>Image Editor</Title>}
                bordered={false}
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  height: "100%",
                }}
              >
                <Upload
                  customRequest={({ file, onSuccess, onError }) => {
                    try {
                      handleImageUpload(file);
                      onSuccess();
                    } catch (error) {
                      onError(error);
                    }
                  }}
                  showUploadList={false}
                  accept="image/*"
                  style={{ marginBottom: "24px" }}
                >
                  <Button type="primary" icon={<UploadOutlined />}>
                    Upload Image
                  </Button>
                </Upload>

                <div
                  ref={drop}
                  style={{
                    width: "100%",
                    height: "400px",
                    position: "relative",
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    marginTop: "20px"
                  }}
                >
                  {image && localImage && (
                    <div
                      style={{
                        position: "absolute",
                        left: localImage?.left,
                        top: localImage?.top,
                        width: localImage?.width,
                        height: localImage?.height,
                        transform: `rotate(${localImage?.rotation}deg)`,
                        opacity: localImage?.opacity,
                        cursor: "move",
                      }}
                    >
                      <img
                        src={localImage?.src}
                        alt="Draggable"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        draggable={false}
                      />
                    </div>
                  )}
                </div>

                {currentImage && (
                  <div style={{ marginTop: "16px" }}>
                    <Title level={5}>Advanced Image Manipulation</Title>
                    <div style={{ marginBottom: "16px" }}>
                      <label>Rotation: </label>
                      <Slider
                        min={0}
                        max={360}
                        value={localImage?.rotation || 0}
                        onChange={(value) => rotateImage(value)}
                      />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label>Opacity: </label>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={localImage?.opacity || 1}
                        onChange={(value) => adjustOpacity(value)}
                      />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label>Width: </label>
                      <Slider
                        min={50}
                        max={500}
                        value={localImage?.width || 200}
                        onChange={(value) =>
                          resizeImage({
                            width: value,
                            height: localImage?.height,
                          })
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label>Height: </label>
                      <Slider
                        min={50}
                        max={500}
                        value={localImage?.height || 200}
                        onChange={(value) =>
                          resizeImage({
                            width: localImage?.width,
                            height: value,
                          })
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label>Move Left/Right: </label>
                      <Slider
                        min={-250}
                        max={250}
                        value={localImage?.left || 0}
                        onChange={(value) =>
                          moveImage({ left: value, top: localImage?.top })
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label>Move Up/Down: </label>
                      <Slider
                        min={-250}
                        max={250}
                        value={localImage?.top || 0}
                        onChange={(value) =>
                          moveImage({ left: localImage?.left, top: value })
                        }
                      />
                    </div>
                    <Button
                      type="primary"
                      onClick={handleSave}
                      style={{ width: "100%" }}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                bordered={false}
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  height: "100%",
                }}
              >
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
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </DndProvider>
  );
};

export default PdfImageEditor;

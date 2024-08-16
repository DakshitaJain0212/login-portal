import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPdfData, setPdfDetails } from '../store/actions/action';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import { DndProvider } from 'react-dnd';
import { Button, Card, Col, Row, Typography, notification } from 'antd';
import { UploadOutlined, FilePdfOutlined } from '@ant-design/icons';
import PdfViewer from './PdfViewer'; 
import PdfEditorPage from './PdfEditorPage';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Title } = Typography;

const Home = () => {
  const [modifiedPdf, setModifiedPdf] = useState(null);
  const dispatch = useDispatch();
  const pdfUrl = useSelector((state) => state.pdfEditor.pdfData);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const pdfBytes = e.target.result;
        if (!(pdfBytes instanceof ArrayBuffer)) {
          throw new Error('File data is not an ArrayBuffer.');
        }

        const pdfDoc = await PDFDocument.load(pdfBytes);
        const numPages = pdfDoc.getPageCount();
        const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
        dispatch(setPdfData(url));
        dispatch(setPdfDetails(url, numPages));
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'An error occurred while loading the PDF file.',
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' });

  useEffect(() => {
    if (pdfUrl) {
      dispatch(setPdfData(pdfUrl));
    }
  }, [pdfUrl, dispatch]);

  const handleManipulate = (pdfBytes) => {
    const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
    setModifiedPdf(url);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div >
        <Row gutter={16}>
          <Col span={24} >
            <Card
              bordered={false}
              style={{  padding: '24px', background: '#f0f2f5'}}
              cover={
                <div {...getRootProps()} style={{
                  border: '2px dashed #1890ff',
                  borderRadius: '4px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? '#e6f7ff' : '#fff',
                  boxSizing: 'border-box',
                  width: '100%',
                  maxWidth: '900px',
                  margin: '0 auto'
                }}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <Title level={4} style={{ color: '#1890ff' }}>Drop the files here...</Title>
                  ) : (
                    <>
                      <UploadOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                      <Title level={4}>Drag & Drop or Click to Upload PDF</Title>
                    </>
                  )}
                </div>
              }
            />
          </Col>
          {pdfUrl && (
            <Col span={24}>
              <Card
                title="PDF Viewer"
                bordered={false}
                style={{ marginBottom: '24px' }}
                extra={<Button type="primary" icon={<FilePdfOutlined />} onClick={() => window.open(pdfUrl, '_blank')}>View PDF</Button>}
              >
                <PdfViewer pdfUrl={pdfUrl} />
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </DndProvider>
  );
};

export default Home;

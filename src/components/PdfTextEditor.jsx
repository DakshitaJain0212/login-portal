import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Select, Card, Typography } from "antd";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useDropzone } from "react-dropzone";
import PdfViewer from "./PdfViewer";
import { SET_PDF_DATA } from "../store/actions/actionTypes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const { Option } = Select;
const { Title } = Typography;

const PdfTextEditor = () => {
  const pdfData = useSelector((state) => state.pdfEditor.pdfData);
  const [fontSize, setFontSize] = useState(12);
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFontSizeChange = (value) => {
    setFontSize(value);
  };

  const applyTextToPdf = async (pdfData, text) => {
    try {
      const existingPdfBytes = await fetch(pdfData).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      firstPage.drawText(text, {
        x: 50,
        y: height / 2 + 300,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      dispatch({
        type: SET_PDF_DATA,
        payload: url,
      });
    } catch (error) {
      console.error("Error embedding font or drawing text:", error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const pdfDataUrl = reader.result;
        dispatch({
          type: SET_PDF_DATA,
          payload: pdfDataUrl,
        });
      };
      reader.readAsDataURL(file);
    },
    [dispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "application/pdf",
  });

  return (
    <>
      <div style={{ marginBottom: "16px" }}>
        <Input.TextArea
          value={text}
          onChange={handleTextChange}
          rows={4}
          placeholder="Enter text to add to PDF"
          style={{ borderRadius: "4px", padding: "10px" }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Select
          defaultValue={fontSize || 12}
          style={{ width: 120 }}
          onChange={handleFontSizeChange}
        >
          <Option value={40}>40</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
          <Option value={200}>200</Option>
          <Option value={300}>300</Option>
          <Option value={400}>400</Option>
         
        </Select>
        <Button
          onClick={() => applyTextToPdf(pdfData, text)}
          type="primary"
          style={{ flex: 1 }}
        >
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default PdfTextEditor;

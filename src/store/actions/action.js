import { SET_PDF_DATA,IMAGE_EDIT, SET_CURRENT_PAGE,UPDATE_TEXT_STYLE, UPDATE_TEXT, ADD_PAGE, DELETE_PAGE, REORDER_PAGE, SET_PDF_DETAILS } from './actionTypes';
import { PDFDocument , rgb, degrees} from 'pdf-lib';

// Action to set PDF bytes data
export const setPdfDetails = (pdfData,numPages) => ({
  type: SET_PDF_DETAILS,
  payload: { pdfData, numPages }, 
});

// Action to set PDF data
export const setPdfData = (pdfUrl) => ({
  type: SET_PDF_DATA,
  payload: pdfUrl, 
});

// Action to set the add page
export const addNewPage = (pdfData) => async (dispatch) => {
  if (!pdfData) return;

  try {
    const existingPdfBytes = await fetch(pdfData).then(res => res.arrayBuffer());

    console.log(pdfData);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const newPage = pdfDoc.addPage([600, 800]);
    const pdfBytes = await pdfDoc.save();
    const updatedPdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const updatedpdfData = URL.createObjectURL(updatedPdfBlob);
    dispatch(setPdfData(updatedpdfData));
    dispatch({ type: ADD_PAGE });
  } catch (error) {
    console.error('Error adding page to PDF:', error);
  }
};


// Async action to delete a page
export const deletePage = (pageIndex) => async (dispatch, getState) => {
    const { pdfData } = getState().pdfEditor;
    console.log(pdfData);
  
    if (!pdfData) return;
  
    try {
      const existingPdfBytes = await fetch(pdfData).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.removePage(pageIndex);
      const pdfBytes = await pdfDoc.save();
      const updatedPdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const updatedPdfUrl = URL.createObjectURL(updatedPdfBlob);
      dispatch({ type: SET_PDF_DATA, payload: updatedPdfUrl });

      dispatch({ type: DELETE_PAGE, payload: pageIndex });
    } catch (error) {
      console.error('Failed to delete page from PDF:', error);
    }
};

// Async action to reorder pages
export const reorderPages = (newOrder) => async (dispatch, getState) => {
  const { pdfData } = getState().pdfEditor;

  if (!pdfData) return; 

  try {
    const existingPdfBytes = await fetch(pdfData).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

     console.log(pages);
    
    
    const reorderedPages = newOrder.map(index => pages[index]);
    console.log(reorderedPages);
    const newPdfDoc = await PDFDocument.create();
    
   
    for (const index of newOrder) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [index]);
      newPdfDoc.addPage(copiedPage);
    }
    
    const newPdfBytes = await newPdfDoc.save();
    const updatedPdfBlob = new Blob([newPdfBytes], { type: 'application/pdf' });
    const updatedPdfUrl = URL.createObjectURL(updatedPdfBlob);
   
    dispatch({ type: SET_PDF_DATA, payload: updatedPdfUrl });
    dispatch({ type: REORDER_PAGE, payload: newOrder });

  } catch (error) {
    console.error('Error reordering PDF pages:', error);
  }
};


// async action to add image to pages
export const addImageToPdf = (imageData) => async (dispatch, getState) => {
    const { pdfData } = getState().pdfEditor;

    if (!pdfData) return;

    try {
        const existingPdfBytes = await fetch(pdfData).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPage(0); 


        const pngImage = await pdfDoc.embedPng(imageData.src);
        page.drawImage(pngImage, {
            x: imageData.left,
            y: imageData.top,
            width: imageData.width,
            height: imageData.height,
            rotate: degrees(imageData.rotation),
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        dispatch({ type: SET_PDF_DATA, payload: url });
        dispatch({ type: IMAGE_EDIT, payload: url });
    } catch (error) {
        console.error('Error in image handling:', error);
    }
};

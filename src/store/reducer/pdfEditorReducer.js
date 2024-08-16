import { SET_PDF_DATA, SET_CURRENT_PAGE,UPDATE_TEXT_STYLE, UPDATE_TEXT, ADD_PAGE, DELETE_PAGE, REORDER_PAGE, SET_PDF_DETAILS } from '../actions/actionTypes';

const initialState = {
  pdfData: null,
  editingText: '',
  pageOrder: [], 
  pdfDetails: null, 
};

const pdfEditorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PDF_DETAILS:
      console.log(action.payload);
      return {
        ...state,
        pdfDetails: action.payload,
        pageOrder: Array.from(Array(action.payload.numPages).keys()),
      };
    case SET_PDF_DATA:
      console.log(action.payload);
      return {
        ...state,
        pdfData: action.payload,
        
      };
    case ADD_PAGE:
    
      return {
        ...state,
        pageOrder: [...state.pageOrder, state.pageOrder.length],
      };
    case DELETE_PAGE:
      
      return { 
        ...state, 
        pageOrder: state.pageOrder.filter((_, index) => index !== action.payload)
          .map((pageIndex, idx) => idx < action.payload ? pageIndex : pageIndex - 1) 
      };
    case REORDER_PAGE:
      return { ...state, pageOrder: action.payload };
    default:
      return state;
  }
};

export default pdfEditorReducer;

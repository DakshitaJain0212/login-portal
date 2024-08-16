import { combineReducers } from 'redux';
import pdfEditorReducer from './pdfEditorReducer';

const rootReducer = combineReducers({
  pdfEditor: pdfEditorReducer,
});

export default rootReducer;

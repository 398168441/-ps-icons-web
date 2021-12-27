import api from "../utils/api";
import { createAction } from "redux-actions";
import { getSvgText, downloadZip } from "../utils/index";

export const FETCH_ICON_LIST = "FETCH_ICON_LIST";
export const FETCH_ICON_COMPONENT = "FETCH_ICON_COMPONENT";
export const UPLOAD_ICONS = "UPLOAD_ICONS";
export const CHECK_ICONS = "CHECK_ICONS";
export const DELETE_ICONS = "DELETE_ICONS";
export const FETCH_TAGS = "FETCH_TAGS";
export const ADD_TAGS = "ADD_TAGS";
export const EXPORT_SVG = "EXPORT_SVG";

export const getIconList = createAction(FETCH_ICON_LIST, (params) =>
  api.get("/list", params)
);

export const getIconComponent = createAction(
  FETCH_ICON_COMPONENT,
  (params) =>
    api.get("/component", params, { "Content-Type": "multipart/form-data" }),
  (params) => params
);

export const uploadIcons = createAction(UPLOAD_ICONS, (params) =>
  api.post("/upload", params)
);

export const checkIcons = createAction(
  CHECK_ICONS,
  (params) => api.post("/upload/check", params),
  () => ({ customError: true })
);
export const deleteIcons = createAction(DELETE_ICONS, (params) =>
  api.post("/delete", params)
);

export const getTags = createAction(FETCH_TAGS, (params) =>
  api.get("/tag/list", params)
);

export const addTags = createAction(ADD_TAGS, (params) =>
  api.post("/tag/add", params)
);

// export const exportSvg = createAction(EXPORT_SVG, async (icons) => {
//   const JSZip = (await import("jszip")).default;
//   const zipFile = new JSZip();
//   for (let icon of icons) {
//     const data = getSvgText(icon.data, 200, "#333");
//     zipFile.file(`${icon.name}.svg`, data);
//   }
//   const content = await zipFile.generateAsync({ type: "blob" });
//   downloadZip(content);
// });

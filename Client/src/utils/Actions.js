const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
  CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
  LEAVE: "leave",
  SPACEDATA_CHANGE: "spaceData-change",
  LEFT: "left",
  FILE_METADATA_CHANGE: "file-metadata-change",
  SYNC_FILE_METADATA: "sync-file-metadata",
};

module.exports = ACTIONS;


//Purpose: Using a constants file like this prevents typos and makes the code more maintainable. 
// If you need to change an event name, you only have to do it in one place. 
// Every time you see ACTIONS.JOIN, the code is referring to the string "join".
